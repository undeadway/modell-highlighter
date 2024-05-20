# ModellHighLighter

## Chinese

### 关于
纯JS 打造同于将代码输出成网页格式的代码高亮器。  

### 支持的语言列表

* C
* C++（未测试）
* C#
* CSS
* HTML
* JAVA
* JAVASCRIPT
* JSON
* PHP（未测试）
* SQL
* VB（未测试）
* VBA
* VBSCRIPT（未测试）
* VB.NET（未测试）
* XML

### 安装
#### Node.js
在Node.js中，只需要执行
```
npm install Modellhighlighter
```
即可完成所有安装，然后在项目中引入即可。
```
require("Modellhighlighter");
```
就可以开始使用`ModellHighLighter`了。

#### 浏览器
只需要将`dist`文件夹下已编译好的`ModellHighLighter.js`复制到项目中去即可。  
`ModellHighLighter`依赖`Coralian`，所以请事先下载 [coralian](https://gitee.com/undeadway/coralian) 。

### 使用
然后可以通过下面的代码来使用 `ModellHighLighter`
```
var source = "var source = 'test code'";
var langName = "javascript";
var output = ModellHighLighter.execute(source, langName);
```
执行完毕后的`output`即最终可以直接显示的HTML。

## English

### About
A source code highlighter created by pure javascript.

### Supported languages list

* C
* C++（未测试）
* C#
* CSS
* HTML
* JAVA
* JAVASCRIPT
* JSON
* PHP（未测试）
* SQL
* VB（未测试）
* VBA
* VBSCRIPT（未测试）
* VB.NET（未测试）
* XML

### Install
#### Node.js
Run the followen command:
```
npm install Modellhighlighter
```
And import it into project:
```
require("Modellhighlighter");
```

#### Browser
Copy the compired file `ModellHighLighter` to client.  
And `ModellHighLighter` has relied `Coralian`, so download the [coralian](https://gitee.com/undeadway/coralian) first.

### Using
```
var source = "var source = 'test code'";
var langName = "javascript";
var output = ModellHighLighter.execute(source, langName);
```