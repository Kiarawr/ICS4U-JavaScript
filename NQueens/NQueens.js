function getInputValue(){
    var n = Number(document.getElementById("number").value);
    //console.log(n);

    placeQueens(n);
}

function placeQueens(n){
    var filled = 0;
    var stack = [];

    var currentQueen = {row:0, col:0};
    //var previousQueen;

    for (var i = 0; i < n; i++){
        var j = 0;
        currentQueen = {row:i, col :j};

        while (j <= n){
            while (j==n){

                if (filled == 0){
                    console.log("There is no solution");
                    return;
                }

                currentQueen = stack.pop();
                filled --;
                i = currentQueen.row;
                j = currentQueen.col;
                j++;
            }
        

            currentQueen.row = i;
            currentQueen.col = j;

            if (noConflict(currentQueen, filled, stack)){
                filled ++;
                stack.push(currentQueen);
                break;
            }
            else 
                j++;
        }
    }

    printBoard(filled, stack, n);
    
}

function printBoard(filled, stack, n){
    
    var tempQueen = {row: 0, col:0};

    for (var i = 0; i <n; i++){
        tempQueen = stack.pop();
        var printLine = "";

        for (var j = 0; j <n; j++){
            if (tempQueen.col == j)
                //console.log("Q");
                printLine = printLine + "Q ";
            else 
                //console.log("- ");
                printLine = printLine + "- ";
        }
        console.log(printLine);
        //console.log("\n");
    }
}

function noConflict(currentQueen, filled, stack){
    var noConflict = true;
    var tempStack = [];

    var tempQueen = {row: 0, col:0};
    var tempFill = 0;

    for (var i = 0; i < filled; i++){
        tempQueen = stack.pop();
        tempStack.push(tempQueen);
        tempFill++;

        if (currentQueen.col == tempQueen.col || Math.abs(currentQueen.col - tempQueen.col) == Math.abs(currentQueen.row - tempQueen.row)){
            noConflict = false;
            break;
        }
    }

    for (var i = 0; i<tempFill; i++){
        tempQueen = tempStack.pop();
        stack.push(tempQueen);
    }

    return noConflict;

}