import { Difference, DifferenceType } from "../model/Difference";
import { LNode } from "../model/LNode";

class ResultHTML {
    docTemplate(content: string) : string {
        return `<!DOCTYPE html>
                <html lang="en">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <meta http-equiv="X-UA-Compatible" content="ie=edge">
                        <title>HTML Difference</title>
                        <style>
                            .delete { background-color:#FF0000; } 
                            .add { background-color:#00FF00; }
                            .equal { background-color:#FFFFFF; }
                        </style>
                    </head>
                    <body>
                        <pre>${content}</pre>
                    </body>
                </html>`
    }

    itemTemplate(content: string, type: DifferenceType) : string {
        let styleMap = {};

        styleMap[DifferenceType.Added] = "add";
        styleMap[DifferenceType.Deleted] = "delete";
        styleMap[DifferenceType.Equals] = "equal";

        return `<span class=${styleMap[type]}>${content}</span></br>`;
    }

    buildHtml(differences: Difference[]) : string {
        let content: string = ""

        differences.forEach(element => {
            content += this.itemTemplate(element.node?.escapedHtml as string, element.type);
        });

        return this.docTemplate(content);
    }
}

export {ResultHTML}