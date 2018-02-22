Numbas.queueScript('display/parts/numberentry',['display-base','part-display','util'],function() {
    var display = Numbas.display;
    var extend = Numbas.util.extend;
    var util = Numbas.util;

    /** Display code for a {@link Numbas.parts.NumberEntryPart}
     * @augments Numbas.display.PartDisplay
     * @constructor
     * @name NumberEntryPartDisplay
     * @memberof Numbas.display
     */
    display.NumberEntryPartDisplay = function()
    {
        var p = this.part;

        /** The student's current (not necessarily submitted) answer
         * @member {observable|string} studentAnswer
         * @memberof Numbas.display.NumberEntryPartDisplay
         */
        this.studentAnswer = Knockout.observable(p.studentAnswer);

        /** The correct answer
         * @member {observable|number} correctAnswer
         * @memberof Numbas.display.NumberEntryPartDisplay
         */
        this.correctAnswer = Knockout.observable(p.settings.displayAnswer);

        Knockout.computed(function() {
            p.storeAnswer([this.studentAnswer()]);
        },this);

        /** Cleaned-up version of student answer (remove commas and trim whitespace)
         *
         * Also check for validity and give warnings
         * @member {observable|string} cleanStudentAnswer
         * @memberof Numbas.display.NumberEntryPartDisplay
         */
        this.cleanStudentAnswer = Knockout.computed(function() {
            var studentAnswer = p.cleanAnswer(this.studentAnswer());
            this.removeWarnings();
            if(studentAnswer=='')
                return '';

            if(p.settings.integerAnswer) {
                var dp = Numbas.math.countDP(studentAnswer);
                if(dp>0)
                    p.giveWarning(R('part.numberentry.answer not integer'));
            }
            if(!util.isNumber(studentAnswer,p.settings.allowFractions,p.settings.notationStyles)) {
                p.giveWarning(R('part.numberentry.answer not integer or decimal'));
                return '';
            }
            var n = util.parseNumber(studentAnswer,p.settings.allowFractions,p.settings.notationStyles);
            return n+'';
        },this);

        /** Show a LaTeX rendering of the answer?
         * @member {boolean} showPreview
         * @memberof Numbas.display.NumberEntryPartDisplay
         */
        this.showPreview = false;

        /** TeX version of student's answer
         * @member {observable|TeX} studentAnswerLaTeX
         * @memberof Numbas.display.NumberEntryPartDisplay
         */
        this.studentAnswerLaTeX = Knockout.computed(function() {
            return this.cleanStudentAnswer();
        },this);

        /** Does the input box have focus?
         * @member {observable|boolean} inputHasFocus
         * @memberof Numbas.display.NumberEntryPartDisplay
         */
        this.inputHasFocus = Knockout.observable(false);

        /** Give the input box focus
         * @member {function} focusInput
         * @method
         * @memberof Numbas.display.NumberEntryPartDisplay
         */
        this.focusInput = function() {
            this.inputHasFocus(true);
        }

        /** Some text describing what precision the student should round their answer to
         * @member {observable|string} precisionHint
         * @memberof Numbas.display.NumberEntryPartDisplay
         */
        this.precisionHint = Knockout.computed(function() {
            if(this.part.settings.precisionType=='none') {
                if(this.part.settings.mustBeReduced) {
                    return R('part.numberentry.give your answer as a reduced fraction');
                } else {
                    return '';
                }
            } else {
                var precision = this.part.settings.precision;
                var precisionType = R('part.numberentry.precision type.'+this.part.settings.precisionType,{count:precision});
                if (precision === 0) {
                  return R('part.numberentry.give your answer to precision_0',{count: precision,precisionType: precisionType});
                } else {
                  return R('part.numberentry.give your answer to precision',{count: precision,precisionType: precisionType});
                }
            }
        },this);

        /** Show the precision restriction hint?
         * @member {observable|string} showPrecisionHint
         * @memberof Numbas.display.NumberEntryPartDisplay
         */
        this.showPrecisionHint = Knockout.computed(function() {
            return this.part.settings.showPrecisionHint && this.precisionHint();
        },this);


        /** Some text describing what precision the student should round their answer to
         * @member {observable|string} fractionHint
         * @memberof Numbas.display.NumberEntryPartDisplay
         */
        this.fractionHint = Knockout.computed(function() {
            if(this.part.settings.fractionType=='none') {
                if(this.part.settings.mustBeReduced) {
                    return R('part.numberentry.give your answer as a reduced fraction');
                } else {
                    return '';
                }
            } else {
                var fraction = this.part.settings.fraction;
                var fractionType = R('part.numberentry.fraction type.'+this.part.settings.fractionType,{count:fraction});
                if (fraction === 0) {
                  return R('part.numberentry.give your answer to fraction_0',{count: fraction,fractionType: fractionType});
                } else {
                  return R('part.numberentry.give your answer to fraction',{count: fraction,fractionType: fractionType});
                }
            }
        },this);

        /** Show the fraction restriction hint?
         * @member {observable|string} showFractionHint
         * @memberof Numbas.display.NumberEntryPartDisplay
         */
        this.showFractionHint = Knockout.computed(function() {
            return this.part.settings.showFractionHint && this.fractionHint();
        },this);
    }
    display.NumberEntryPartDisplay.prototype =
    {
        restoreAnswer: function()
        {
            this.studentAnswer(this.part.studentAnswer);
        }
    };
    display.NumberEntryPartDisplay = extend(display.PartDisplay,display.NumberEntryPartDisplay,true);
});
