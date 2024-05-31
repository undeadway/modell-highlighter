
--组织表
CREATE TABLE T_ORG (
	OID	 INTEGER	  PRIMARY KEY AUTOINCREMENT,
	ONAME	VARCHAR (10) NOT NULL
						UNIQUE,
	MAX_CNT INTEGER	  DEFAULT (1) 
						NOT NULL
);

-- 用户表
CREATE TABLE T_UPD_DATA (
	UUID		INTEGER	  REFERENCES T_USER
							NOT NULL
							PRIMARY KEY,
	ISBN		VARCHAR (13) REFERENCES T_BOOK (ISBN) 
							NOT NULL,
	UPD_TIME	VARCHAR (6)  NOT NULL,
	CHOOSE_TIME DATETIME	 DEFAULT (datetime('now', 'localtime') ) 
							NOT NULL,
	PRIMARY KEY (
		UUID,
		ISBN
	)
);

CREATE UNIQUE INDEX T_USER_INDEX ON T_USER (
	UNAME ASC,
	ORG ASC
);

CREATE UNIQUE INDEX T_UID_INDEX ON T_USER (
	UUID ASC
);

create table t_word_jp_txt (
	"id" serial PRIMARY KEY,
	"kana" varchar(50) collate "ja_JP" not null,
	"kanji" varchar(50) collate "ja_JP" not null
);

-- 导出视图
CREATE VIEW V_EXPORTS AS
	SELECT u.uuid,
			U.UNAME,
			o.oname AS orgnization,
			B.NAME,
			b.upd_time,
			up.choose_time
	  FROM T_UPD_DATA AS UP
			INNER JOIN
			T_USER AS U ON U.UUID = UP.UUID
			INNER JOIN
			T_ORG o ON o.oid = u.org;

COMMENT ON COLUMN "t_edit_log"."create_time" IS '创建时间';
ALTER TABLE "t_edit_log" ADD CONSTRAINT "fk_t_edit_log_word_id" foreign key("word_id") references "t_word_name"("id");

/*  DDL */

		select
			province.code_name as province_name
			, city.code_name as city_name
			, area.code_name as area_name
			, area.code as area_code
		from  wispak_dictionary area
		left join wispak_dictionary city
			on city.code = area.parent_code
		left join wispak_dictionary province
			on province.code = city.parent_code
		where area.type = 'area'
		order by province.code, city.code, area.code