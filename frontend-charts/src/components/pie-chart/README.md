# Класс PieChart
[Назад](../../README.md)

Класс `PieChart` используется для создания круговых диаграмм. Он наследуется от `SandyElement`, использует сервисы для работы с данными и атрибуты, а также управляет жизненным циклом элементов диаграммы.

## Использование

```javascript
import {SandyElement} from '@';
import PieChartStyles from './PieChart.scss?inline';
import {pieChartTemplate} from './PieChartTemplate';
import {attributes, SERVICES} from '@/services/utils';
import {createPieChart} from './utils';
import {inject} from '@/di/di';

export class PieChart extends SandyElement {
    static rootClass = 'pie-chart'

    chartService;
    subscription;
    apiService;

    static attributes = attributes

    constructor() {
        super(PieChartStyles, pieChartTemplate.bind(null, {rootClass: PieChart.rootClass}));
        this.chartService = inject(SERVICES.ChartDataService);
        this.apiService = inject(SERVICES.ApiService);
    }

    onAttributeChange(name, oldValue, newValue) {
        if (this.chartService.hasChartKey(newValue)) {
            this.subscription = this.chartService.subscribe(newValue, this.initData.bind(this));
        }
    }

    async initData(config){
        const data = await this.apiService.get(config.url);
        this.createChart(data);
    }

    onDisconnect() {
        this.subscription?.unsubscribe();
    }

    createChart(data) {
        const pieChartElement = this.shadowRoot.querySelector(.${PieChart.rootClass});
        pieChartElement.innerHTML = '';

        createPieChart(data, pieChartElement)
            .withTooltip()
            .withHoverActions()
            .withSelectAction();
    }
}
```

## Методы и Свойства

### `static rootClass`

Статическое свойство, чьим значением является класс, применяемый к HTML элементу (div) диаграммы.

### `chartService`

Свойство, которое хранит ссылку на сервис `ChartDataService`.

### `subscription`

Свойство, где будет храниться подписка на обновления данных диаграммы.

### `apiService`

Свойство, которое хранит ссылку на сервис `ApiService`.

### `onAttributeChange(name, oldValue, newValue)`

Запускается всякий раз, когда один из наблюдаемых атрибутов изменяется. Если для нового значения атрибута существуют данные для диаграммы, вызывается `initData()` с этими данными.

### `async initData(config)`

Асинхронный метод, который получает данные для конкретной диаграммы и создает диаграмму

### `onDisconnect()`

Запускается перед тем, как элемент будет отключен от DOM. Отменяет подписку на обновления данных диаграммы.

### `createChart(data)`

Создает диаграмму с помощью функции createPieChart, добавляет всплывающую подсказку, обрабатывает наведение мыши и обрабатывает действие выбора.

# Функция pieChartTemplate

Функция `pieChartTemplate` используется для создания шаблона HTML-строки, который будет использоваться для круговой диаграммы.

## Использование

```javascript
export function pieChartTemplate({rootClass}) {
    return `
        <div class="${rootClass}"></div>`;
}
```
Применяется как функция форматирования для создания HTML-шаблона. Функция принимает объект с крутящимся классом диаграммы и применяет его к главному div здесь:

`<div class="${rootClass}"></div>`

Этот шаблон затем используется для создания элемента диаграммы в родительском классе `PieChart`.

## Параметры

Функция принимает один аргумент:

### `{rootClass}`

Объект с одним свойством, `rootClass`, которое является строкой, представляющей имя класса, применяемого к div элементу диаграммы.

## Возвращаемое значение

Данная функция возвращает строку HTML, которая представляет собой шаблон для создания div элемента с заданным классом. Это будет выглядеть следующим образом:

```html
<div class="имя_класса"></div>
```
где `имя_класса` это значение `rootClass`, переданное в функцию.

# Описание функции withSelectAction

Функция `withSelectAction` обрабатывает событие клика на элементе круговой диаграммы (секторе). При клике на сектор функция выполняет следующие действия:

1. Определяет, есть ли у выбранного (кликнутого) объекта класс `active`. Cохраняет булево значение (истина или ложь) в переменную `alreadyHaveClass`.

2. Очищает стили и удаляет класс `active` у подходящих элементов класса `.path`.

3. После очистки классов и стилей, генератор выбирает кликнутый элемент (сектор диаграммы) и меняет его состояние и стиль.

    - Если у элемента уже есть класс `active`, он будет убран, а если нет - он будет добавлен.

    - В зависимости от того, был ли у объекта класс `active`, к нему применяется серый цвет (`grey`), толщина линии (`3px`) и стиль (`6px`) или очищаются (null).

4. Наконец, функция возвращает `this`, тем самым обеспечивая поддержку цепного вызова.

# Пример использования

```javascript
somePieChart
        .withSelectAction()
        .render();
```
В этом примере `withSelectAction` применяется к объекту `somePieChart` до вызова метода `render`.

# Исходный код

```javascript
function withSelectAction() {
    path.on('click', function () {
        const alreadyHaveClass = select(this).classed('active');

        g.selectAll('.path')
            .classed('active', false)
            .style('stroke', null)
            .style('stroke-width', null)
            .style('stroke-dasharray', null);

        select(this)
            .classed('active', !alreadyHaveClass)
            .transition()
            .attr('d', arcGeneratorHover)
            .style('stroke', !alreadyHaveClass ? 'grey' : null)
            .style('stroke-width', !alreadyHaveClass ? '3px' : null)
            .style('stroke-dasharray', !alreadyHaveClass ? '6px' : null);
    });
    return this;
}
```

Важно: Функция предполагает наличие свободных переменных path, g и arcGeneratorHover, которые должны быть определены во внешней области видимости.

Вот подробное описание функции `withTooltip`:

```markdown
# Function: withTooltip

`withTooltip` функция из библиотеки D3.js добавляет всплывающие подсказки к элементам диаграммы.

## Описание

Когда вызывается, функция добавляет новый `div` элемент к `body` документа с набором стилей, которые определяют его видимость, положение и внешний вид. По умолчанию этот `div` прозрачен (`opacity` равно 0).

## Использование

```js
withTooltip();
```

Вызов функции должен быть связан с событием, в котором вам необходимо показывать подсказку (например, при наведении мыши на элемент диаграммы).

## Стили

Были добавлены следующие стили:

- `position`: 'absolute' — позиция относительно ближайшего позиционированного родительского элемента (вместе с элементом body)
- `background-color`: 'white' — задаёт белый цвет фона
- `padding`: '.5rem' — внутренний отступ
- `border-radius`: '.2rem' — скругление границ
- `pointer-events`: 'none' — указывает, что события мыши для элемента должны быть проигнорированы и не должны влиять на его поведение
- `opacity`: 0 — делает элемент невидимым

Как только подсказка готова к отображению информации, можно изменить ее прозрачность на 1, чтобы сделать ее видимой.

## Возвращаемое значение

Функция возвращает `this` - ссылка на объект, вызвавший метод. Это позволяет использовать цепочку методов (method chaining) для вызова последующих функций или методов на том же объекте.

# Функция `withHoverActions`

Функция `withHoverActions` является пользовательской функцией, определенной для отслеживания действий с мышью и реагирования на них путем обновления визуализации и отображения всплывающих подсказок.

## Как это работает

Функция `withHoverActions` последовательно выполняет следующие действия:

1. **Выбор всплывающей подсказки:** `tooltip` выбирается с помощью класса `.tooltip`.

2. **Настроено действие при `mouseout` для `g`:** Если курсор мыши отходит от элементов внутри `g`, `mouseout` происходит. Все пути, которые не имеют класса `active`, возвращаются к исходному состоянию вместе с всплывающей подсказкой, которая становится невидимой.

3. **Действие на событие `mouseout` для каждого `path`:** Когда курсор мыши покидает определенный путь, он возвращается к своему исходному состоянию.

4. **Действие на событие `mouseover` для каждого `path`:** Когда курсор мыши наводится на определенный участок, происходит ряд действий:

    - Данный путь перемещается и применяется фильтр тени.
    - Все другие пути, не являющиеся активными, уменьшаются.
    - Всплывающая подсказка появляется рядом с текущим положением указателя мыши, отображая имя и вес данных.

5. **Событие `mousemove` для каждого `path`:** При перемещении указателя мыши внутри пути, всплывающая подсказка продолжает следовать за курсором.

6. **Return statement:** В конце функции возвращается `this`, что позволяет цепочке вызовов продолжиться.

## Заключение

Функция `withHoverActions` обеспечивает интерактивность для визуализации, позволяя пользователям получать дополнительную информацию через всплывающие подсказки и визуальные обратные связи через анимацию элементов.

# d3.js Pie Chart Arc Generators

Функция `createGenerators(pieDiameter)` создаёт набор генераторов дуг. Генератор дуг - это специальная функция обеспечивающая создание SVG пути для каждого сегмента графика.

Входной параметр `pieDiameter` это диаметр пирога (круговой диаграммы), который впоследствии используется для определения радиуса каждой дуги.

## d3.js Arc Generator

Функция `arc()` из библиотеки d3.js создаёт генератор дуг, который используется для создания SVG путей на основе входных данных.

```javascript
const arcGenerator = arc()
    .innerRadius(0)
    .outerRadius(pieDiameter / 3);
```
Методы `innerRadius(0)` и `outerRadius(pieDiameter / 3)` определяют внутренний и внешний радиусы дуги соответственно. В данном случае, дуги создаются как на полную ширину пирога, так и с постепенными ступенями для обеспечения разных вида дуг в круговой диаграмме.

## Additional Arc Generators

```javascript
const arcGeneratorSmall = arc()
    .innerRadius(0)
    .outerRadius((pieDiameter / 3) * 0.8);

const arcGeneratorStart = arc()
    .innerRadius(0)
    .outerRadius((pieDiameter / 100) * 0.1);

const arcGeneratorHover = arc()
    .innerRadius(0)
    .outerRadius((pieDiameter / 3) * 1.2);
```

Функция `createGenerators(pieDiameter)` также создаёт дополнительные генераторы дуг для разных сценариев:

- `arcGeneratorSmall`: генератор дуги с уменьшенным внешним радиусом. Это может быть полезно, например, для визуализации выбранного сегмента или для создания "эффекта нажатия" при взаимодействии пользователя.
- `arcGeneratorStart`: генератор с очень маленьким внешним радиусом. Может использоваться для анимации появления дуги.
- `arcGeneratorHover`: генератор с увеличенным внешним радиусом. Может использоваться для создания эффекта "при наведении".

Функция `createGenerators(pieDiameter)` возвращает объект с четырьмя генераторами дуг, которые можно использовать для создания сегментов круговой диаграммы с разными эффектами.

```javascript
return {
    arcGenerator,
    arcGeneratorSmall,
    arcGeneratorHover,
    arcGeneratorStart
};
```

## Usage

На практике эти генераторы можно использовать следующим образом:
```javascript
let path = svg.selectAll('path')
    .data(pieGenerator(someData))
    .enter().append('path')
    .attr('d', arcGenerator)  // использование генератора при создании пути
    .attr('fill', 'someColor');
```

Когда пользователь наводит курсор мыши на сегмент, можно изменить генератор дуги на `arcGeneratorHover`:

```javascript
path.on('mouseover', function() {
    select(this).transition()
        .duration(300)
        .attr('d', arcGeneratorHover);
});
```

# createPieChart

`createPieChart` функция в JavaScript, создающая круговую диаграмму с использованием D3.js.

## Описание

Функция `createPieChart` принимает датасет и HTML элемент в качестве аргументов. Она создает круговую диаграмму на основе переданных данных и прикрепляет ее к указанному элементу.

- Возьмите функцию `pieGenerator` из библиотеки `d3.pie`. Вызываем метод `.value`, который устанавливает значения для каждого сегмента в круговой диаграмме.
- Создаем цветовую шкалу `color` на основе данных.
- Определяем диаметр круговой диаграммы.

В блоке `svg` мы дополняем  `pieChartElement` новым элементом `svg`, устанавливаем ему диаметр и добавляем группу элементов `g`.

В блоке `path` мы привязываем данные к каждому элементу `path` и устанавливаем различные атрибуты и стили.

В блоке `defs` мы определяем некоторые фильтры для применения эффектов к диаграмме.

Функция возвращает объект с тремя методами: `withTooltip`, `withHoverActions`, `withSelectAction`.

## Использование

```js
const data = [
    {weight: 100, name: 'Segment1'},
    {weight: 200, name: 'Segment2'},
    {weight: 150, name: 'Segment3'}
];
const element = document.getElementById('myChart');
createPieChart(data, element);
```

В этом примере, функция `createPieChart` будет создавать круговую диаграмму на основе массива `data` и прикрепит ее к HTML элементу с ID `myChart`.

## Возвращаемый объект

Объект, который функция возвращает, содержит следующие методы:

- `withTooltip()`: Добавляет всплывающие подсказки к элементам диаграммы.
- `withHoverActions()`: Обработчик событий при наведении мыши на элементы диаграммы.
- `withSelectAction()`: Обработчик событий при клике на элементы диаграммы.

Пример использования:

```js
createPieChart(data, element)
    .withTooltip()
    .withHoverActions()
    .withSelectAction();
```
Важно: Код функций `withTooltip`, `withHoverActions`, `withSelectAction` пока не представлен, поэтому они пока не будут работать, как ожидается.