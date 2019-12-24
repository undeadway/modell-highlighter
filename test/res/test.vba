' 添加新的空白行
Private Sub AddNewLine_Click()

    RowCount = Application.CountA(ActiveSheet.Range("F:F"))
    LastRowNo = RowCount + 1
    NewRowNo = RowCount + 2

    ActiveSheet.Range(LastRowNo & ":" & LastRowNo).Copy  ' 最后一行数据
    ActiveSheet.Range(NewRowNo & ":" & NewRowNo).Insert
    
    ActiveSheet.Range("B" & NewRowNo).Value = "" ' 级别
    ActiveSheet.Range("D" & NewRowNo).Value = "" ' 类别
    ActiveSheet.Range("F" & NewRowNo).Value = "" ' 信息名
    ActiveSheet.Range("G" & NewRowNo).Value = "" ' 信息代码

End Sub

' 生成一个Java枚举类
Private Sub CreateJavaEnum_Click()

    outStr = "public enum MessageTable {" & vbCrLf & vbCrLf
    
        Set targetWb = ActiveSheet

    With targetWb
        RowCount = Application.CountA(.Range("F:F"))
        
          For i = 3 To RowCount + 1

            Dim CodeName$
            Dim CodeInfo$
            Dim CodeCoding$
        
           CodeName = .Range("G" & i)
           CodeInfo = .Range("F" & i)
           CodeCoding = .Range("I" & i)
           'ILLEGAL_ARGUMENTS(50000, "参数不正确")
           outStr = outStr & "    " & CodeName & "(" & CodeCoding & ",""" & CodeInfo & """)," & vbCrLf
        Next
        
        outStr = outStr & "    ;" & vbCrLf & vbCrLf
        outStr = outStr & "    private int code;" & vbCrLf
        outStr = outStr & "    private String text;;" & vbCrLf & vbCrLf
        outStr = outStr & "    private MessageTable(int code, String text) {" & vbCrLf
        outStr = outStr & "        this.code = code;" & vbCrLf
        outStr = outStr & "        this.text = text;" & vbCrLf & "    }" & vbCrLf & vbCrLf
        outStr = outStr & "    public int getCode() {" & vbCrLf
        outStr = outStr & "        return this.code;" & vbCrLf
        outStr = outStr & "    }" & vbCrLf & vbCrLf
        
        outStr = outStr & "    public String getText() {" & vbCrLf
        outStr = outStr & "        return this.text;" & vbCrLf
        outStr = outStr & "    }" & vbCrLf & "}"
        
    End With
    
    Call saveTxt(outStr, "MessageTable.java")

    MsgBox "生成 Java枚举类 完成"

End Sub

' 生成一个 json
Private Sub CreateJSON_Click()

    outStr = "{" & vbCrLf
    Set targetWb = ActiveSheet

    With targetWb
        RowCount = Application.CountA(.Range("F:F"))
           
        For i = 3 To RowCount + 1

            Dim CodeName$
            Dim CodeInfo$
            Dim CodeCoding$
        
           CodeName = .Range("G" & i)
           CodeInfo = .Range("F" & i)
           CodeCoding = .Range("I" & i)
           '"ILLEGAL_ARGUMENTS" : {"text": "参数不正确", "code": 50000}
           outStr = outStr & "  " & """" & CodeName & """ : {""text"": """ & CodeInfo & """, ""code"":" & CodeCoding & "}," & vbCrLf
        Next
        
        outStr = Left(outStr, Len(outStr) - 3) & vbCrLf & "}"
    
    End With
    Call saveTxt(outStr, "MessageTable.json")

    MsgBox "生成 json 完成"

End Sub

Function saveTxt(outStr, outFile) As String
    Dim f$
    f = ThisWorkbook.Path & "\" & outFile
'    '按默认编码GB2312输出
'    Open f For Output As #1
'    Print #1, outStr
'    Close #1
    
'    '以utf-8输出(带BOM)
'    Dim objStream As Object
'    Set objStream = CreateObject("ADODB.Stream")
'    With objStream
'        .Type = 2
'        .Charset = "UTF-8"
'        .Open
'        .WriteText outStr
'        .SaveToFile f, 2
'    End With
    '以utf-8输出(不带bom)
    ' ADODB.Streamを作成
    Dim stream: Set stream = CreateObject("ADODB.Stream")
    ' 1.最初にtext-modeでUTF-8で書き込む
    stream.Type = 2                ' adTypeText
    stream.Charset = "UTF-8"
    stream.Open
    stream.WriteText (outStr)
    
    ' 2.Postions归零
    stream.Position = 0
    stream.Type = 1                ' adTypeBinary
    
    ' 3.Position以3byte读入
    stream.Position = 3
    Dim bin: bin = stream.Read()
    stream.Close
    
    ' 二进制输出
    Dim restream: Set restream = CreateObject("ADODB.Stream")
    restream.Type = 1                ' dTypeBinary
    restream.Open
    restream.Write (bin)
    restream.SaveToFile f, 2  ' force overwrite
    restream.Close
End Function
