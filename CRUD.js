/*

- touch [fileName]: 
指定した名前のファイルをカレントディレクトリに作成します。ファイルが既に存在する場合は、
ノードのdateModified値を現在の日付に更新します。

- mkdir [dirName]: 
与えられた名前でカレントディレクトリに新しいディレクトリを作成します。

- ls [?option] [?filePathOrDirPath]: 
ターゲットノードがディレクトリの場合、ターゲットディレクトリノードの直下の全てのファイルリストを出力します。
(ターゲットノードがファイルの場合、与えられたノードのみ出力します。権限やファイル作成時間を出力)
引数が存在しない場合、カレントディレクトリの全てのファイルリストを出力します。
オプション
 -r 逆順に一覧表示します。
 -a 隠しファイルを含むすべてのファイルを表示する .で始まるファイル名は隠しファイル
 
- cd [..| dirPath]: 
現在の作業ディレクトリを指定されたものに変更します。引数が'..'の場合はカレントディレクトリを親ディレクトリに、
そうでない場合はカレントディレクトリを指定されたパスに存在しているディレクトリに変更します。

- pwd: 
現在の作業ディレクトリのパスを出力します。

- print [fileName]: 
カレントディレクトリ内の指定されたfileNameの.content値（ファイルの情報）を表示します。
存在しないファイル名だった場合エラーを出力する。

- setContent [fileName] [content値]: 
与えられたfileNameの.content値をカレントディレクトリに設定します。


- rm [fileOrDirName]: 
指定したfileOrDirNameのファイルまたはディレクトリをカレントディレクトリから削除します。

-move [dirPath]移動元  [dirPath]移動先
dirPathをもとにして、ターゲットディレクトリから目的地のディレクトリにノードを移動する

-copy [dirPath]移動元  [dirPath]移動先
dirPathをもとにして、ターゲットディレクトリから目的地のディレクトリにノードをコピーする
ディレクトリのコピーは部分木全体を再帰的にコピーする

*/

/* 
有効コマンドであるどうか確認するべきこととして

-touch 
コマンドは2
カレントディレクトリに、指定したファイル名が存在していないかどうか

-mkdir
コマンドは2
カレントディレクトリに、指定したディレクトリ名が存在していないかどうか

-ls
コマンドは1～4まで
指定したファイルパスまたはディレクトリパスが存在するかどうか
オプションが有効文字かどうか

-cd, move, copy
コマンドは2
指定したディレクトリパスが存在しているかどうか

-pwd
コマンドは1

-print, setContent
コマンドは2
カレントディレクトリに、指定したファイルバスが存在するかどうか

-rm
コマンドは2
指定したファイルパスまたはディレクトリパスが存在するかどうか
    
*/

// ファイルシステム構築
class Node{
    constructor(data, type, parent){
        this.data = data; //自身のファイル（フォルダ）名
        this.parent = parent; //親ノードの参照
        this.type = type; // file or dir
        let tempDate = new Date(Date.now());
        this.createDate = tempDate.toDateString() + " " + tempDate.toTimeString();
        this.content = this.type == 'file' ? null : 'This is directory'; 
        // typeがfileなら初期値nullを与え、dirであるならdirであることを伝えるだけに留める
        this.next = null; // 走査できるように同じ階層のディレクトリで前後をつなげておく
        this.prev = null;
        this.list = new DoublyLinkedList(); // 子ノードリスト
    }

    setType(type){
        this.type = type;
    }

    getChildNodeList(){
        return this.list;
    }

    deepCopy(){
        let newNode = new Node(this.data, this.type, this.parent);
        if(this.list.head == null) return newNode;
        
        let iterator = this.list.head;
        while(iterator != null){
            newNode.list.addLast(iterator);
            iterator = iterator.next;
        }
        return newNode;
    }
}

class DoublyLinkedList{
    // 子ノードの管理
    constructor(){
        this.head = null;
        this.tail = this.head;
    }

    addLastNode(node){
        let newNode = node;
        if (this.head === null){
            this.head = newNode;
            this.tail = this.head;
        } else {
            this.tail.next = newNode;
            newNode.prev = this.tail;
            newNode.next = null;
            this.tail = newNode;
        }
    }

    addLast(data, type, parent){
        let newNode = new Node(data, type, parent);
        if (this.head === null){
            this.head = newNode;
            this.tail = this.head;
        } else {
            this.tail.next = newNode;
            newNode.prev = this.tail;
            newNode.next = null;
            this.tail = newNode;
        }

    }

    addFront(data, type, parent){
        let newNode = new Node(data, type, parent);
        if (this.head === null){
            this.head = newNode;
            this.tail = this.head;
        } else {
            this.head.prev = newNode;
            newNode.next = this.head;
            newNode.prev = null;
            this.head = newNode;
        }
    }

    popLast(){
        if (this.tail === null) return;
        this.tail = this.tail.prev;

        if(this.tail != null) this.tail.next = null;
        else this.head = null;
    }

    popFront(){
        if (this.head === null) return;
        this.head = this.head.next;
        
        if(this.head != null) this.head.prev = null;
        else this.tail = null;
    }

    remove(key){
        let iterator = this.head;
        while(iterator != null){
            if (iterator.data === key) break;
            iterator = iterator.next;
        }
        
        if (iterator === this.head) this.popFront();
        else if(iterator === this.tail) this.popLast();
        else {
            iterator.prev.next = iterator.next;
            iterator.next.prev = iterator.prev;
        }
    }

    search(key){
        let iterator = this.head;
        while(iterator != null){
            if(iterator.data === key) break;
            iterator = iterator.next;
        }
        return iterator;
    }

    printIn(){
        let iterator = this.head;
        let str = "";
        if (iterator == null) return str;// 空の場合

        while(iterator.next != null){
            str += iterator.type == 'file' && iterator.data[0] == "." ? '' : iterator.type == 'file' ? `<span style='color:lime'>${iterator.data}</span>` + ' ' : iterator.data + ' ';
            iterator = iterator.next;
        }   
        str += iterator.type == 'file' && iterator.data[0] == "." ? '' : iterator.type == 'file' ? `<span style='color:lime'>${iterator.data}</span>` + ' ' : iterator.data + ' ';
        return str;
    }

    printInOption(){
        let iterator = this.head;
        let str = "";
        if (iterator == null) return str;// 空の場合

        while(iterator.next != null){
            str += iterator.type == "file" ? `<span style='color:lime'>${iterator.data}</span>` + ' ' : iterator.data + " ";
            iterator = iterator.next;
        }
        str += iterator.type == "file" ? `<span style='color:lime'>${iterator.data}</span>` + ' ' : iterator.data + " ";
        return str;
    }

    printInReverse(){
        let iterator = this.tail;
        let str = "";
        if (iterator == null) return str;// 空の場合

        while(iterator.prev != null){
            str += iterator.type == 'file' && iterator.data[0] == "." ? '' : iterator.type == 'file' ? `<span style='color:lime'>${iterator.data}</span>` + ' ' : iterator.data + " ";
            iterator = iterator.prev;
        }
        str += iterator.type == 'file' && iterator.data[0] == "." ? '' : iterator.type == 'file' ? `<span style='color:lime'>${iterator.data}</span>` + ' ' : iterator.data + " ";
        return str;
    }

    printInReverseOption(){
        let iterator = this.tail;
        let str = "";
        if (iterator == null) return str;// 空の場合

        while(iterator.prev != null){
            str += iterator.type == 'file' ? `<span style='color:lime'>${iterator.data}</span>` + ' ': iterator.data + " ";
            iterator = iterator.prev;
        }
        str += iterator.type == "file" ? `<span style='color:lime'>${iterator.data}</span>` + ' ' : iterator.data + " ";
        return str;
    }
}

class FileSystem{
    constructor(){
        this.root = new Node('/', "dir", null);
        this.currentDir = this.root;
    }

    touch(fileName, parent = this.currentDir){
        if (this.currentDir.getChildNodeList().search(fileName) === null) {
            this.currentDir.list.addLast(fileName, 'file', parent);
            return {'isValid': true, 'message': `created file named ${fileName}`};
        }
        else return {'isValid': false, 'message':'This file name already exists.'};
    }

    mkdir(dirName, parent = this.currentDir){
        if (this.currentDir.getChildNodeList().search(dirName) === null){
            this.currentDir.list.addLast(dirName, 'dir', parent);
            return {'isValid': true, 'message': `created directory named ${dirName}`};
        }
        else return {'isValid': false, 'message':'This directory name already exists.'};
    }

    ls4(option1, option2, key){
        let validOptionList = ["-r", "-a"];

        if (validOptionList.indexOf(option1) == -1 || validOptionList.indexOf(option2) == -1){
            return {'isValid': false, 'message': `That option is not supported. For more information, see the help command`};
        }

        let target = this.currentDir.list.search(key);
        if (target === null) {
            return {'isValid': false, 'message': 'no file in this directory'};
        }

        if (target.type === 'file') {
            return {'isValid': true, 'message': `${target.data}`};
        }
        else{
            return {'isValid': true, 'message': `${target.getChildNodeList().printInReverseOption()}`};
        }
    }

    ls3(arg1, arg2){
        let validOptionList = ["-r", "-a"];
        let isALL = false;
        let isReverse = false;

        if (validOptionList.indexOf(arg1) != -1){
            if (arg1 == "-a"){
                isALL = true;
            }
            else{
                isReverse = true;
            }
        }

        if (validOptionList.indexOf(arg2) != -1){
            if (arg2 == "-a"){
                isALL = true;
            }
            else{
                isReverse = true;
            }
        }

        if (isALL && isReverse){
            return {'isValid': true, 'message': `${this.currentDir.getChildNodeList().printInReverseOption()}`};
        }
        else if (isALL){
            let target = this.currentDir.list.search(arg2);
            if (target === null) {
                return {'isValid': false, 'message': 'no file in this directory'};
            }

            if (target.type === 'file') {
                return {'isValid': true, 'message': `${target.data}`};
            }
            else{
                return {'isValid': true, 'message': `${target.getChildNodeList().printInOption()}`};
            }
        }
        else if (isReverse){
            let target = this.currentDir.list.search(arg2);
            if (target === null) {
                return {'isValid': false, 'message': 'no file in this directory'};
            }

            if (target.type === 'file') {
                return {'isValid': true, 'message': `${target.data}`};
            }
            else{
                return {'isValid': true, 'message': `${target.getChildNodeList().printInReverse()}`};
            }
        }
        else {
            return {'isValid': false, 'message': `Not a valid command, see help command`};
        }
    }

    ls2(arg){
        if (arg[0] == "-"){
            if (arg == "-a"){
                return {'isValid': true, 'message': `${this.currentDir.getChildNodeList().printInOption()}`};
            } 
            else if (arg == "-r"){
                return {'isValid': true, 'message': `${this.currentDir.getChildNodeList().printInReverse()}`};
            } 
            else{
                return {'isValid': false, 'message': `That option is not supported. For more information, see the help command`};
            }
        }
        else {
            let target = this.currentDir.list.search(arg);
            if (target === null) {
                return {'isValid': false, 'message': 'no file in this directory'};
            }

            if (target.type === 'file') {
                return {'isValid': true, 'message': `${target.data}`};
            }
            else{
                return {'isValid': true, 'message': `${target.getChildNodeList().printIn()}`};
            }
        }
    }

    ls1(){
        return {'isValid': true, 'message': `${this.currentDir.getChildNodeList().printIn()}`};
    }

    cd(cmd){
        if(cmd === ".." && this.currentDir === this.root){
            return {'isValid': false, 'message': `Already located in the root directory`};
        } 
        else if(cmd === ".."){
            let message = this.currentDir.parent.data;
            this.currentDir = this.currentDir.parent;
            return {'isValid': true, 'message': `Located in ${message}`};
        }
        else {
            let target = this.currentDir.list.search(cmd);
        
            if (target !== null && target.type === 'dir'){
                this.currentDir = target;
                return {'isValid': true, 'message': `Located in ${cmd}`};
            }
            else{
                return {'isValid': false, 'message': `The directory ${cmd} does not exist.`};
            }
        }
    }

    pwd(){
        let iterator = this.currentDir;
        let str = '';
        while(iterator != this.root){
            console.log(iterator.data);
            str = iterator.data + '/' + str; 
            iterator = iterator.parent;
        }
        str = str.slice(0, str.length-1);
        return {'isValid': true, 'message': `/${str}`};
    }

    setContent(fileName, comment){
        let target = this.currentDir.list.search(fileName);
        if (target !== null){
            target.content = comment;
            return {'isValid': true, 'message': `The content value could be set to ${comment}.`};
        }
        else return {'isValid': false, 'message': 'there is no file such file'};
    }

    print(fileName){
        let target = this.currentDir.list.search(fileName);
        if (target != null){
            return {'isValid': true, 'message': `${target.content}`};
        }
        else return {'isValid': false, 'message': 'there is no file such file'};
    }

    rm(fileOrDirName){
        let target = this.currentDir.list.search(fileOrDirName);
        if (target !== null){
            this.currentDir.list.remove(fileOrDirName);
            return {'isValid': true, 'message': `${fileOrDirName} is deleted.`};
        }
        else return {'isValid': false, 'message': 'there is no file such file or directory'};
    }

    move(departDirPathOrFile, desDirPath){
        // それぞれパスを配列にしておく
        let departPathArray = departDirPathOrFile.split("/").filter(dirName => dirName != '');
        let desPathArray = desDirPath.split("/").filter(dirName => dirName != '');
        
        // 絶対パスであるとき
        if (departDirPathOrFile[0] === "/"){
            // ファイルシステムの中でルートから始めて、目的のディレクトリが存在しているか確かめる
            let departNode = this.searchDirectoryPath(this.root, departPathArray);
            if (departNode == null){
                return {'isValid': false, 'message': `Departure path ${departDirPathOrFile} is incorrect`};
            }

            // 目的地のディレクトリが存在しているか確認する 絶対or相対もまた確認
            let desNode;
            if (desDirPath[0] === "/"){
                desNode = this.searchDirectoryPath(this.root, desPathArray);
                if (desNode == null){
                    return {'isValid': false, 'message': `Destination path ${desDirPath} is incorrect`};
                }
            }
            else if (desDirPath.includes("/")){
                desNode = this.searchDirectoryPath(this.currentDir, desPathArray);
                if (desNode == null){
                    return {'isValid': false, 'message': `Destination path ${desDirPath} is incorrect`};
                }
            }
            else {
                return {'isValid': false, 'message': `Destination path ${desDirPath} is incorrect`};
            }
            
            // ノードを動かす
            departNode.parent.list.remove(departNode.data);
            departNode.next = null;
            departNode.parent = desNode;
            desNode.list.addLastNode(departNode);
            
            return {'isValid': true, 'message': `Move ${departDirPathOrFile} to ${desDirPath}`};
        }
        // 相対パスであるとき
        else if (departDirPathOrFile.includes("/")){
            // ファイルシステムの中でカレントディレクトリから始めて、目的のディレクトリが存在しているか確かめる
            let departNode = this.searchDirectoryPath(this.currentDir, departPathArray);
            if (departNode == null){
                return {'isValid': false, 'message': `Departure path ${departDirPathOrFile} is incorrect`};
            }

            // 目的地のディレクトリが存在しているか確認する 絶対or相対もまた確認
            let desNode;
            if (desDirPath[0] === "/"){
                desNode = this.searchDirectoryPath(this.root, desPathArray);
                if (desNode == null){
                    return {'isValid': false, 'message': `Destination path ${desDirPath} is incorrect`};
                }
            }
            else if (desDirPath.includes("/")){
                desNode = this.searchDirectoryPath(this.currentDir, desPathArray);
                if (desNode == null){
                    return {'isValid': false, 'message': `Destination path ${desDirPath} is incorrect`};
                }
            }
            else {
                return {'isValid': false, 'message': `Destination path ${desDirPath} is incorrect`};
            }

            // ノードを動かす
            departNode.parent.list.remove(departNode.data);
            departNode.next = null;
            departNode.parent = desNode;
            desNode.list.addLastNode(departNode);

            return {'isValid': true, 'message': `Move ${departDirPathOrFile} to ${desDirPath}`};
        }
        // カレントディレクトリに存在しているだろうノードであるとき
        else {
            // カレントディレクトリにファイルが存在しているのか確かめる
            let departNode = this.searchDirectoryPath(this.currentDir, departPathArray);
            if (departNode == null){
                return {'isValid': false, 'message': `Departure path ${departDirPathOrFile} is incorrect`};
            }

            // 目的地のディレクトリが存在しているか確認する 絶対or相対もまた確認
            let desNode;
            if (desDirPath[0] === "/"){
                desNode = this.searchDirectoryPath(this.root, desPathArray);
                if (desNode == null){
                    return {'isValid': false, 'message': `Destination path ${desDirPath} is incorrect`};
                }
            }
            else if (desDirPath.includes("/")){
                desNode = this.searchDirectoryPath(this.currentDir, desPathArray);
                if (desNode == null){
                    return {'isValid': false, 'message': `Destination path ${desDirPath} is incorrect`};
                }
            }
            else {
                return {'isValid': false, 'message': `Destination path ${desDirPath} is incorrect`};
            }

            // ノードを動かす
            departNode.parent.list.remove(departNode.data);
            departNode.next = null;
            departNode.parent = desNode;
            desNode.list.addLastNode(departNode);

            return {'isValid': true, 'message': `Move ${departDirPathOrFile} to ${desDirPath}`};
        }
    }

    copy(departDirPathOrFile, desDirPath){
        // それぞれパスを配列にしておく
        let departPathArray = departDirPathOrFile.split("/").filter(dirName => dirName != '');
        let desPathArray = desDirPath.split("/").filter(dirName => dirName != '');

        // 絶対パスであるとき
        if (departDirPathOrFile[0] === "/"){
            // ファイルシステムの中でルートから始めて、目的のディレクトリが存在しているか確かめる
            let departNode = this.searchDirectoryPath(this.root, departPathArray);
            if (departNode == null){
                return {'isValid': false, 'message': `Departure path ${departDirPathOrFile} is incorrect`};
            }

            // 目的地のディレクトリが存在しているか確認する 絶対or相対もまた確認
            let desNode;
            if (desDirPath[0] === "/"){
                desNode = this.searchDirectoryPath(this.root, desPathArray);
                if (desNode == null){
                    return {'isValid': false, 'message': `Destination path ${desDirPath} is incorrect`};
                }
            }
            else if (desDirPath.includes("/")){
                desNode = this.searchDirectoryPath(this.currentDir, desPathArray);
                if (desNode == null){
                    return {'isValid': false, 'message': `Destination path ${desDirPath} is incorrect`};
                }
            }
            else {
                return {'isValid': false, 'message': `Destination path ${desDirPath} is incorrect`};
            }
            
            // ノードを動かす
            /* 
            copy /user/shun/res /user/saki
            departNode: res
            
            */
            let target = departNode.parent.list.search(departNode.data);
            let newNode = target.deepCopy();
            newNode.parent = desNode;
            desNode.list.addLastNode(newNode);
            
            return {'isValid': true, 'message': `Copy ${departDirPathOrFile} to ${desDirPath}`};
        }
        // 相対パスであるとき
        else if (departDirPathOrFile.includes("/")){
            // ファイルシステムの中でカレントディレクトリから始めて、目的のディレクトリが存在しているか確かめる
            let departNode = this.searchDirectoryPath(this.currentDir, departPathArray);
            if (departNode == null){
                return {'isValid': false, 'message': `Departure path ${departDirPathOrFile} is incorrect`};
            }

            // 目的地のディレクトリが存在しているか確認する 絶対or相対もまた確認
            let desNode;
            if (desDirPath[0] === "/"){
                desNode = this.searchDirectoryPath(this.root, desPathArray);
                if (desNode == null){
                    return {'isValid': false, 'message': `Destination path ${desDirPath} is incorrect`};
                }
            }
            else if (desDirPath.includes("/")){
                desNode = this.searchDirectoryPath(this.currentDir, desPathArray);
                if (desNode == null){
                    return {'isValid': false, 'message': `Destination path ${desDirPath} is incorrect`};
                }
            }
            else {
                return {'isValid': false, 'message': `Destination path ${desDirPath} is incorrect`};
            }

            // ノードを動かす
            let target = departNode.parent.list.search(departNode.data);
            let newNode = target.deepCopy();
            newNode.parent = desNode;
            desNode.list.addLastNode(newNode);
            
            return {'isValid': true, 'message': `Copy ${departDirPathOrFile} to ${desDirPath}`};
        }
        // カレントディレクトリに存在しているだろうノードであるとき
        else {
            // カレントディレクトリにファイルが存在しているのか確かめる
            let departNode = this.searchDirectoryPath(this.currentDir, departPathArray);
            if (departNode == null){
                return {'isValid': false, 'message': `Departure path ${departDirPathOrFile} is incorrect`};
            }

            // 目的地のディレクトリが存在しているか確認する 絶対or相対もまた確認
            let desNode;
            if (desDirPath[0] === "/"){
                desNode = this.searchDirectoryPath(this.root, desPathArray);
                if (desNode == null){
                    return {'isValid': false, 'message': `Destination path ${desDirPath} is incorrect`};
                }
            }
            else if (desDirPath.includes("/")){
                desNode = this.searchDirectoryPath(this.currentDir, desPathArray);
                if (desNode == null){
                    return {'isValid': false, 'message': `Destination path ${desDirPath} is incorrect`};
                }
            }
            else {
                return {'isValid': false, 'message': `Destination path ${desDirPath} is incorrect`};
            }

            // ノードを動かす
            let target = departNode.parent.list.search(departNode.data);
            let newNode = target.deepCopy();
            newNode.parent = desNode;
            desNode.list.addLastNode(newNode);
            
            return {'isValid': true, 'message': `Copy ${departDirPathOrFile} to ${desDirPath}`};
        }
    }

    // 相対パス、絶対パスに対応してファイルシステムからディレクトリを探す関数
    searchDirectoryPath(startdirectory, pathList){
        let iterator = startdirectory;
    
        for(let i = 0; i < pathList.length; i++){
            if (pathList[i] == ".."){
                iterator = iterator.parent;
                continue;
            }
            let target = iterator.list.search(pathList[i])
            if(target == null) return null;
            iterator = target;
        }
        return iterator;
    }
}


// 上矢印と下矢印で、ユーザが以前の CLI 入力を参照できる「履歴」機能
class CommandNode{
    constructor(command){
        this.command = command;
        this.prev = null;
        this.next = null;
    }
}

class CommandHistory{
    constructor(){
        this.head = null;
        this.tail = null;
        this.current = this.head;
    }

    addFront(command){
        let newNode = new CommandNode(command);
        if (this.head === null){
            this.head = newNode;
            this.tail = this.head;
        } else {
            this.head.prev = newNode;
            newNode.next = this.head;
            newNode.prev = null;
            this.head = newNode;
        }

        this.reset();
    }

    backToPrevious(){
        this.current = this.current.next == null ? this.current: this.current.next;
        return this.current.command;
    }

    goToNew(){
        this.current = this.current.prev == null ? this.current: this.current.prev;
        return this.current.command;
    }

    // コマンドが出力されたらカレントの位置を先頭に戻しておく
    reset(){
        this.current = this.head;
    }
}

const config = {
    CLIOutputDivID: "shell",
    CLITextInputID: "shellInput"
}

let CLIOutputDiv = document.getElementById(config.CLIOutputDivID);
let CLITextInput = document.getElementById(config.CLITextInputID);

let fs = new FileSystem();
let history = new CommandHistory();

// rmが一つ前に入力されているかどうかを表す
let isRM = false;
let removeTarget;

CLITextInput.addEventListener("keyup", (event) => {outputCommand(event)});

function outputCommand(event){
    if (event.key == "Enter"){
        // 入力されたテキストを解析して、"packageName commandName arguments "
        //を表す3つの文字列要素の配列にします。
        let parsedCLIArray = CrudOperation.commandLineParser(CLITextInput.value);

        // 入力が何もされていなければそこで終了
        if (parsedCLIArray.length == 0){
            CrudOperation.appendErrorParagraph(CLIOutputDiv);

            CLIOutputDiv.scrollTop = CLIOutputDiv.scrollHeight;
            CLITextInput.value = '';

            return;
        }

        // 入力されたテキストがCLIにechoされます。 
        // カレントディレクトリを指定して、毎回表示していまどこにいるのかを知らせるようにする
        CrudOperation.appendEchoParagraph(CLIOutputDiv, fs.pwd().message);

        // 上下キーでコマンド履歴を参照するために、双方向リストにコマンドを加えて置く
        history.addFront(CLITextInput.value);

        // 提出後、テキストフィールドをクリアにします。
        CLITextInput.value = '';

        // 入力のコマンド数の検証を行い、 {'isValid': <Boolean>, 'errorMessage': <String>} の形をした連想配列を作成します。
        let validatorResponse = CrudOperation.universalValidator(parsedCLIArray);
        
        if(validatorResponse['isValid'] == false){ 
            // エラーメッセージの出力
            CrudOperation.appendResultParagraph(CLIOutputDiv, false, validatorResponse['errorMessage']);
        }
        else {
            // command実行、結果の取得
            // 入力したファイル（フォルダ）名やパス名の検証を行い、 {'isValid': <Boolean>, 'message': <String>} の形をした連想配列を作成します。
            // 入力検証でこれを確認してしまうと走査を二度行うことになって、効率が悪いため別々に行う
            let result = CrudOperation.runCommand(parsedCLIArray, fs);

            if (result['isValid'] == false){
                CrudOperation.appendResultParagraph(CLIOutputDiv, false, result['message']);
            }
            else {
                CrudOperation.appendResultParagraph(CLIOutputDiv, true, result['message']);
            }
        }
        
        // 出力divを常に下にスクロールします。 
        CLIOutputDiv.scrollTop = CLIOutputDiv.scrollHeight;
    }
    else if (event.key == "ArrowUp"){
        if (history.current != null ){
            CLITextInput.value = history.backToPrevious();
        }
    }
    else if (event.key == "ArrowDown"){
        if (history.current != null ){
            CLITextInput.value = history.goToNew();
        }
    }
}

class CrudOperation{
    static commandLineParser(CLIInputString)
    {
        let parsedStringInputArray = CLIInputString.trim().split(" ");
        return parsedStringInputArray;
    }

    static appendEchoParagraph(parentDiv, promptName)
    {
        parentDiv.innerHTML+=
            `<p class="m-0">
                <span style='color:green'>student</span>
                <span style='color:magenta'>@</span>
                <span style='color:blue'>recursionist</span>
                <span style='color:white'>: ${promptName}> </span>
                 ${CLITextInput.value}
            </p>`;

        return;
    }

    static appendErrorParagraph(parentDiv)
    {
        parentDiv.innerHTML+=
            `<p class="m-0">
                <span style='color:red'>CLIError</span>: invalid input. must take form "packageName commandName" or "packageName commandName arguments"
                where packageName is 'ATools', commandName is either 'isbn-lookup' or 'search', and there are exactly 1 or 2 whitespaces.
            </p>`;

        return
    }

    static universalValidator(parsedStringInputArray)
    {
        // 有効コマンド
        let validCommandList = ["touch", "mkdir", "ls", "cd", "pwd", "print", "setContent", "rm", "move", "copy", "help", "yes", "no"];

        // コマンドと引数の関係
        // {touch:1, mkdir:1, ls:0～3, cd:1, pwd:0, print:1, setContent:2, rm:1, move:2, copy:2, help:0}
        let yesOrNo = ["yes", "no"];
        let zeroArgOfCommandList = ["pwd", "help"];
        let oneArgOfCommandList = ['touch','mkdir','cd','print','rm'];
        let twoArgOfCommandList = ["setContent", "move", "copy"];
        
        if (validCommandList.indexOf(parsedStringInputArray[0]) == -1){
            return {'isValid': false, "errorMessage": `Only supports the following commands: ${validCommandList.join(",")}`}
        }
        else if (zeroArgOfCommandList.indexOf(parsedStringInputArray[0]) != -1 && parsedStringInputArray.length != 1){
            return {'isValid': false, 'errorMessage': `The ${parsedStringInputArray[0]} command requires no arguments`};
        }
        else if (oneArgOfCommandList.indexOf(parsedStringInputArray[0]) != -1 && parsedStringInputArray.length != 2){
            return {'isValid': false, 'errorMessage': `The ${parsedStringInputArray[0]} command requires 1 argment`};
        }
        else if (twoArgOfCommandList.indexOf(parsedStringInputArray[0]) != -1 && parsedStringInputArray.length != 3){
            return {'isValid': false, 'errorMessage': `The ${parsedStringInputArray[0]} command requires 2 argments`};
        }
        else if (parsedStringInputArray[0] === "ls" && (parsedStringInputArray.length > 5)){
            return {'isValid': false, 'errorMessage': `The ls command requires 0~3 argments`};
        }
        else if (yesOrNo.indexOf(parsedStringInputArray[0].toLowerCase()) != -1 && parsedStringInputArray.length != 1){
            return {'isValid': false, 'errorMessage': `The ${parsedStringInputArray[0]} command requires no arguments`};
        }
        else if (yesOrNo.indexOf(parsedStringInputArray[0].toLowerCase()) != -1 && !isRM){
            return {'isValid': false, "errorMessage": `Only supports the following commands: ${validCommandList.join(",")}`};
        }
        
        return {'isValid': true, 'errorMessage': ''}
    }

    static appendResultParagraph(parentDiv, isValid, message)
    {
        let promptName = "";
        let promptColor = "";
        if (isValid){
            promptName = "CCTools";
            promptColor = "turquoise";
        }
        else{
            promptName = "CCToolsError";
            promptColor = "red";
        }
        
        parentDiv.innerHTML+=
                `<p class="m-0">
                    <span style='color: ${promptColor}'>${promptName}</span>: ${message}
                </p>`;
        return;
    }

    static runCommand(parsedArray, fs){
        switch(parsedArray[0]){
            case 'touch':
                return fs.touch(parsedArray[1]);
            case 'mkdir':
                return fs.mkdir(parsedArray[1]);
            case 'ls':
                if (parsedArray.length == 4) return fs.ls4(parsedArray[1], parsedArray[2], parsedArray[3]);
                else if (parsedArray.length == 3) return fs.ls3(parsedArray[1], parsedArray[2]);
                else if (parsedArray.length == 2) return fs.ls2(parsedArray[1]);
                else return fs.ls1();
            case 'cd':
                return fs.cd(parsedArray[1]);
            case 'pwd':
                return fs.pwd();
            case 'print':
                return fs.print(parsedArray[1]);
            case 'setContent':
                return fs.setContent(parsedArray[1], parsedArray[2]);    
            case 'rm':
                isRM = true;
                removeTarget = parsedArray[1];
                return {'isValid': true, 'message': `are you sure? yes/no`};
            case 'move':
                return fs.move(parsedArray[1], parsedArray[2]);
            case 'copy':
                return fs.copy(parsedArray[1], parsedArray[2]);
            case 'help':
                return {'isValid': true, 'message': `${helpMessage}`};
            case 'yes':
                isRM = false;
                return fs.rm(removeTarget);
            case 'no':
                isRM = false;
                return {'isValid': true, 'message': `The elimination was cancelled.`};
        }
    }
}

let helpMessage = `<br>
- touch [fileName]: <br>
指定した名前のファイルをカレントディレクトリに作成します。<br>
<br>
- mkdir [dirName]: <br>
与えられた名前でカレントディレクトリに新しいディレクトリを作成します。<br>
<br>
- ls [?option] [?filePathOrDirPath]: <br>
ターゲットノードがディレクトリの場合、ターゲットディレクトリノードの直下の全てのファイルリストを出力します。
(ターゲットノードがファイルの場合、与えられたノードのみ出力します。)
引数が存在しない場合、カレントディレクトリの全てのファイルリストを出力します。
オプションとファイル/ディレクトリ名の順番は変更できません<br>
・オプション<br>
 -r 逆順に一覧表示します。<br>
 -a 隠しファイルを含むすべてのファイルを表示する <br>
 <br>
- cd [..| dirPath]: <br>
現在の作業ディレクトリを指定されたものに変更します。引数が'..'の場合はカレントディレクトリを親ディレクトリに、
そうでない場合はカレントディレクトリを指定されたパスに存在しているディレクトリに変更します。<br>
<br>
- pwd: <br>
現在の作業ディレクトリのパスを出力します。<br>
<br>
- print [fileName]: <br>
カレントディレクトリ内の指定されたfileNameの.content値(ファイルの情報)を表示します。
存在しないファイル名だった場合エラーを出力する。<br>
<br>
- setContent [fileName] [content値]: <br>
与えられたfileNameの.content値をカレントディレクトリに設定します。<br>
<br>
- rm [fileOrDirName]: <br>
指定したfileOrDirNameのファイルまたはディレクトリをカレントディレクトリから削除します。<br>
<br>
-move [dirPath]移動元  [dirPath]移動先<br>
dirPathをもとにして、ターゲットディレクトリから目的地のディレクトリにノードを移動する<br>
<br>
-copy [dirPath]移動元  [dirPath]移動先<br>
dirPathをもとにして、ターゲットディレクトリから目的地のディレクトリにノードをコピーする
ディレクトリのコピーは部分木全体を再帰的にコピーする<br>
`;