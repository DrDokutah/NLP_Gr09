/*
 * Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */

import Worker from 'worker-loader!../function/worker';
/* global document, Office, Word */
let worker;
Office.onReady(info => {
  if (info.host === Office.HostType.Word) {
    document.getElementById("sideload-msg").style.display = "none";
    document.getElementById("app-body").style.display = "flex";
    document.getElementById("start").onclick = run;
    worker = new Worker();
  }
});


export async function run() {
    return Word.run(async context => {
        const docBody = context.document.body;
        context.load(docBody, ['text', 'paragraphs']);
        return context.sync().then(() => {
            const paragraphs = docBody.paragraphs.items;
            const text = docBody.text;
            docBody.untrack();
            document.getElementById('vn').removeAttribute('hidden');
            var data = { paragraphs, text };
            worker.postMessage(JSON.stringify(data));
            worker.onmessage = e =>
                {
                    const { rLettersCount, rCharsCount, rSyllablesCount, rPuncMarksCount, rWordsCount, rUniqueWordsCount, rSentsCount, rParsCount } = e.data;
                    document.getElementById('0').innerText = rLettersCount;
                    document.getElementById('1').innerText = rCharsCount;
                    document.getElementById('2').innerText = rWordsCount;
                    document.getElementById('3').innerText = rUniqueWordsCount;
                    document.getElementById('4').innerText = rSentsCount;
                    document.getElementById('5').innerText = rParsCount;
                    document.getElementById('6').innerText = rPuncMarksCount;
                    document.getElementById('7').innerText = rSentsCount / rParsCount;
                    document.getElementById('8').innerText = rWordsCount / rSentsCount;
                    document.getElementById('9').innerText = rLettersCount / rWordsCount;
                    document.getElementById('10').innerText = rSyllablesCount;
                }
            return context.sync();
        });
    });
}

