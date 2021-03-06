
//begin-------------------ARE.Label---------------------begin

ARE.Label = ARE.DisplayObject.extend({
    "ctor": function(option) {
        this._super();
        this.value = option.value;
        this.fontSize = option.fontSize;
        this.fontFamily = option.fontFamily;
        this.color = option.color;
        this.textAlign = "center";
        this.textBaseline = "top";
        this.fontWeight = option.fontWeight || "";
        this.maxWidth = option.maxWidth || 2e3;
        this.square = option.square || false;
        this.txtCanvas = document.createElement("canvas");
        this.txtCtx = this.txtCanvas.getContext("2d");
        this.setDrawOption();
        this._watch(this, ["value", "fontSize", "color", "fontFamily"], function(a, b) {
            this.setDrawOption();
        });
    },
    "setDrawOption": function() {
        var drawOption = this.getDrawOption({
            txt: this.value,
            maxWidth: this.maxWidth,
            square: this.square,
            size: this.fontSize,
            alignment: this.textAlign,
            color: this.color || "black",
            fontFamily: this.fontFamily,
            fontWeight:this.fontWeight
        });
        this.cacheID = ARE.UID.getCacheID();
        this.width = drawOption.calculatedWidth;
        this.height = drawOption.calculatedHeight;
    },
    "getDrawOption": function(option) {
        var canvas = this.txtCanvas;
        var ctx = this.txtCtx;
        var canvasX, canvasY;
        var textX, textY;
        var text = [];
        var textToWrite = option.txt;
        var maxWidth = option.maxWidth;
        var squareTexture = option.square;
        var textHeight = option.size;
        var textAlignment = option.alignment;
        var textColour = option.color;
        var fontFamily = option.fontFamily;
        var fontWeight = option.fontWeight;
        var backgroundColour = option.backgroundColour;
        ctx.font = textHeight + "px " + fontFamily;
        if (maxWidth && this.measureText(ctx, textToWrite) > maxWidth) {
            maxWidth = this.createMultilineText(ctx, textToWrite, maxWidth, text);
            canvasX = this.getPowerOfTwo(maxWidth);
        } else {
            text.push(textToWrite);
            canvasX = this.getPowerOfTwo(ctx.measureText(textToWrite).width);
        }
        canvasY = this.getPowerOfTwo(textHeight * (text.length + 1));
        if (squareTexture) {
            canvasX > canvasY ? canvasY = canvasX : canvasX = canvasY;
        }
        option.calculatedWidth = canvasX;
        option.calculatedHeight = canvasY;
        canvas.width = canvasX;
        canvas.height = canvasY;
        switch (textAlignment) {
        case "left":
            textX = 0;
            break;
        case "center":
            textX = canvasX / 2;
            break;
        case "right":
            textX = canvasX;
            break;
        }
        textY = canvasY / 2;
        ctx.fillStyle = textColour;
        ctx.textAlign = textAlignment;
        ctx.textBaseline = "middle";
        ctx.font = fontWeight+" "+textHeight + "px " + fontFamily;
        var offset = (canvasY - textHeight * (text.length + 1)) * .5;
        option.cmd = [];
        for (var i = 0; i < text.length; i++) {
            if (text.length > 1) {
                textY = (i + 1) * textHeight + offset;
            }
            option.cmd.push({
                text: text[i],
                x: textX,
                y: textY
            });
            ctx.fillText(text[i], textX, textY);
        }
        return option;
    },
    "getPowerOfTwo": function(value, pow) {
        var pow = pow || 1;
        while (pow < value) {
            pow *= 2;
        }
        return pow;
    },
    "measureText": function(ctx, textToMeasure) {
        return ctx.measureText(textToMeasure).width;
    },
    "createMultilineText": function(ctx, textToWrite, maxWidth, text) {
        textToWrite = textToWrite.replace("\n", " ");
        var currentText = textToWrite;
        var futureText;
        var subWidth = 0;
        var maxLineWidth = 0;
        var wordArray = textToWrite.split(" ");
        var wordsInCurrent, wordArrayLength;
        wordsInCurrent = wordArrayLength = wordArray.length;
        while (this.measureText(ctx, currentText) > maxWidth && wordsInCurrent > 1) {
            wordsInCurrent--;
            var linebreak = false;
            currentText = futureText = "";
            for (var i = 0; i < wordArrayLength; i++) {
                if (i < wordsInCurrent) {
                    currentText += wordArray[i];
                    if (i + 1 < wordsInCurrent) {
                        currentText += " ";
                    }
                } else {
                    futureText += wordArray[i];
                    if (i + 1 < wordArrayLength) {
                        futureText += " ";
                    }
                }
            }
        }
        text.push(currentText);
        maxLineWidth = this.measureText(ctx, currentText);
        if (futureText) {
            subWidth = this.createMultilineText(ctx, futureText, maxWidth, text);
            if (subWidth > maxLineWidth) {
                maxLineWidth = subWidth;
            }
        }
        return maxLineWidth;
    },
    "draw": function(ctx) {
        ctx.fillStyle = this.color;
        ctx.font = this.font;
        ctx.textAlign = this.textAlign || "left";
        ctx.textBaseline = this.textBaseline || "top";
        ctx.fillText(this.text, 0, 0);
    }
});

//end-------------------ARE.Label---------------------end
