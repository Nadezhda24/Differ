<p align="center">
<h2 align="center">Сравнение HTML</h2>
</p>

Решение:
------------
Описание алгоритма, шаги:
1. Распарсить HTML документ в DOM (использовалась библиотека cheerio)
2. Линеаризовать оба документа (исходный и целевой). На данном этапе мы конвертируем документы из древовидного графа данных в линейный список узлов с дополнительным описанием.
3. Вычислить хэши для каждого узла, чтобы оптимизировать операцию сравнения узлов друг с другом.
4. Сравнить два списка друг с другом и составить список отличий (псевдокод ниже):
~~~
s1 - исходный список, считанный из файлай1
s2 - список, считанный из файла, в котором хранится измененная верстка (с которой мы и ищем различия)

int[] existancePositions = new int[s1.Length];
// -1 в этом массиве будет означать что элемент из списка s1 не существует в списке s2 (в валидной позиции) 

for (int i = s1.Length - 1; i >= 0; --i)
{
    bool exists = false;

    int startPos = s2.Length;

    // нам нужно получить "значащую" стартовую позицию, если позиция будет равна -1, то это означает что элемент был удалён и мы не будем знать откуда нам начать поиски текущего элемента, поэтому ищем последнюю "значащую" позицию
    for (int x = i + 1; x < s1.Length; ++x)
    {
        if (existancePositions[x] != -1)
        {
            startPos = existancePositions[x];
            break;
        }
    }

    int oldStartPos = s2.Length;

    for (int x = i + 2; x < s1.Length; ++x)
    {
        if (existancePositions[x] != -1)
        {
            oldStartPos = existancePositions[x];
            break;
        }
    }

    if (oldStartPos - startPos > 1)
    {
        for (int j = oldStartPos - 1; j > startPos && !exists; --j)
        {
            if (s1[i] == s2[j])
            {
                exists = true;
                existancePositions[i] = j;
                existancePositions[i+1] = -1;
            }
        }
    }

    for (int j = startPos - 1; j >= 0 && !exists; --j)
    {
        if (s1[i] == s2[j])
        {
            exists = true;
            existancePositions[i] = j;
        }
    }

    if (!exists)
    {
        existancePositions[i] = -1;
    }
}
~~~

5. Составить на основе массива отличий список отличий (псевдокод ниже):
~~~
int lastNotDeletedItemPos = 0;

for (int i = 0; i < s1.Length; ++i)
{
    if (existancePositions[i] != -1)
    {
        // добавляем все новые элементы (такими считаются все элементы, которые попали в диапазон уже имеюшихся в s2 элементов из s1)
        if (existancePositions[i] - lastNotDeletedItemPos > 1)
        {
            for (int j = lastNotDeletedItemPos + 1; j < existancePositions[i]; ++j)
            {
                differences.push(Difference(null, s2[j]));
            }
        }

        lastNotDeletedItemPos = existancePositions[i];

        // добавляем элементы которые остались без изменений
        differences.push(Difference(s1[i], s2[existancePositions[i]]));
    } 
    else
    {
        // добавляем элементы которые были удалены, для них позиция в s2 массиве равна -1 (позиции хранятся в массиве existancePositions)
        differences.push(Difference(s1[i], null));
    }
}
~~~

6. На основе списка изменений генерируем новый список узлов.
7. На основе нового списка узлов восстанавливаем иерархию блоков в HTML (должен получиться валидный HTML с заданными стилями для отображения всех удаленных и добавленных элементов))
8. Сохраняем восстановленную иерархию

У текущего решения, к сожалению, не реализованы пункты 7 и 8.

Настройки окружения:
------------
1. Необходимо установить [Node.js](https://nodejs.dev/en/) последней версии


Установка:
------------
~~~
1. git clone https://github.com/Nadezhda24/Differ.git path/to/project
2. cd path/to/project
3. npm install
4. npm install -g typescript
~~~

[npm](https://www.npmjs.com/) - консольный менеджер пакетов, поставляемый вместе с Node.js


Запуск:
------------
~~~
tsc app.ts | node app.js
~~~
