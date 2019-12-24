/******************************************************************************
** This file is an amalgamation of many separate C source files from SQLite
** version 3.7.15.1.  By combining all the individual C code files into this 
** single large file, the entire code can be compiled as a single translation
** unit.  This allows many compilers to do optimizations that would not be
** possible if the files were compiled separately.  Performance improvements
** of 5% or more are commonly seen when SQLite is compiled as a single
** translation unit.
**
** This file is all you need to compile SQLite.  To use SQLite in other
** programs, you need this file and the "sqlite3.h" header file that defines
** the programming interface to the SQLite library.  (If you do not have 
** the "sqlite3.h" header file at hand, you will find a copy embedded within
** the text of this file.  Search for "Begin file sqlite3.h" to find the start
** of the embedded sqlite3.h header file.) Additional code files may be needed
** if you want a wrapper to interface SQLite with your choice of programming
** language. The code for the "sqlite3" command-line shell is also in a
** separate file. This file contains only code for the core SQLite library.
*/
#define SQLITE_CORE 1
#define SQLITE_AMALGAMATION 1
#ifndef SQLITE_PRIVATE
# define SQLITE_PRIVATE static
#endif
#ifndef SQLITE_API
# define SQLITE_API
#endif
/************** Begin file sqliteInt.h ***************************************/
/*
** 2001 September 15
**
** The author disclaims copyright to this source code.  In place of
** a legal notice, here is a blessing:
**
**    May you do good and not evil.
**    May you find forgiveness for yourself and forgive others.
**    May you share freely, never taking more than you give.
**
*************************************************************************
** Internal interface definitions for SQLite.
**
*/
#ifndef _SQLITEINT_H_
#define _SQLITEINT_H_

static u32 pager_cksum(Pager *pPager, const u8 *aData){
  u32 cksum = pPager->cksumInit;         /* Checksum value to return */
  int i = pPager->pageSize-200;          /* Loop counter */
  while( i>0 ){
    cksum += aData[i];
    i -= 200;
  }
  return cksum;
}

typedef struct Mem3Block Mem3Block;
struct Mem3Block {
  union {
    struct {
      u32 prevSize;   /* Size of previous chunk in Mem3Block elements */
      u32 size4x;     /* 4x the size of current chunk in Mem3Block elements */
    } hdr;
    struct {
      u32 next;       /* Index in mem3.aPool[] of next free chunk */
      u32 prev;       /* Index in mem3.aPool[] of previous free chunk */
    } list;
  } u;
};


/*
** The following group of routines make deep copies of expressions,
** expression lists, ID lists, and select statements.  The copies can
** be deleted (by being passed to their respective ...Delete() routines)
** without effecting the originals.
**
** The expression list, ID, and source lists return by sqlite3ExprListDup(),
** sqlite3IdListDup(), and sqlite3SrcListDup() can not be further expanded 
** by subsequent calls to sqlite*ListAppend() routines.
**
** Any tables that the SrcList might point to are not duplicated.
**
** The flags parameter contains a combination of the EXPRDUP_XXX flags.
** If the EXPRDUP_REDUCE flag is set, then the structure returned is a
** truncated version of the usual Expr structure that will be stored as
** part of the in-memory representation of the database schema.
*/
SQLITE_PRIVATE Expr *sqlite3ExprDup(sqlite3 *db, Expr *p, int flags){
  return exprDup(db, p, flags, 0);
}
SQLITE_PRIVATE ExprList *sqlite3ExprListDup(sqlite3 *db, ExprList *p, int flags){
  ExprList *pNew;
  struct ExprList_item *pItem, *pOldItem;
  int i;
  if( p==0 ) return 0;
  pNew = sqlite3DbMallocRaw(db, sizeof(*pNew) );
  if( pNew==0 ) return 0;
  pNew->iECursor = 0;
  pNew->nExpr = i = p->nExpr;
  if( (flags & EXPRDUP_REDUCE)==0 ) for(i=1; i<p->nExpr; i+=i){}
  pNew->a = pItem = sqlite3DbMallocRaw(db,  i*sizeof(p->a[0]) );
  if( pItem==0 ){
    sqlite3DbFree(db, pNew);
    return 0;
  } 
  pOldItem = p->a;
  for(i=0; i<p->nExpr; i++, pItem++, pOldItem++){
    Expr *pOldExpr = pOldItem->pExpr;
    pItem->pExpr = sqlite3ExprDup(db, pOldExpr, flags);
    pItem->zName = sqlite3DbStrDup(db, pOldItem->zName);
    pItem->zSpan = sqlite3DbStrDup(db, pOldItem->zSpan);
    pItem->sortOrder = pOldItem->sortOrder;
    pItem->done = 0;
    pItem->iOrderByCol = pOldItem->iOrderByCol;
    pItem->iAlias = pOldItem->iAlias;
  }
  return pNew;
}

#ifdef SQLITE_HAS_CODEC
static void pagerReportSize(Pager *pPager){
  if( pPager->xCodecSizeChng ){
    pPager->xCodecSizeChng(pPager->pCodec, pPager->pageSize,
                           (int)pPager->nReserve);
  }
}
#else
# define pagerReportSize(X)     /* No-op if we do not support a codec */
#endif

static void pagerUnlockAndRollback(Pager *pPager){
  if( pPager->eState!=PAGER_ERROR && pPager->eState!=PAGER_OPEN ){
    assert( assert_pager_state(pPager) );
    if( pPager->eState>=PAGER_WRITER_LOCKED ){
      sqlite3BeginBenignMalloc();
      sqlite3PagerRollback(pPager);
      sqlite3EndBenignMalloc();
    }else if( !pPager->exclusiveMode ){
      assert( pPager->eState==PAGER_READER );
      pager_end_transaction(pPager, 0);
    }
  }
  pager_unlock(pPager);
}