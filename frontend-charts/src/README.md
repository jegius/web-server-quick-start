# Root component и Core logic
# Содержание

1. [Класс App](#Класс-App)
2. [Функция AppTemplate](#Функция-AppTemplate)
3. [Использование registry](#Использование-[registry](./registry/README.md))
4. [Класс SandyElement](#Класс-SandyElement)

[Назад](../README.md)

# Класс SandyElement
[Перейти к содержанию](#Содержание)

`SandyElement` - это базовый класс для работы с кастомными элементами. Он инкапсулирует логику кастомных элементов для облегчения работы с ними.

## Использование

```javascript
import { SandyElement } from '<path-to-sandy-element>';

class MyElement extends SandyElement {
    constructor() {
        super(stylesPath, templateFunc);
        
        // Код конструктора компонента 
    }
}
```

## Методы

### `constructor(pathToStyles, template)`

Конструктор объекта класса SandyElement. Создает Shadow DOM компонента.

**Аргументы:**

- `pathToStyles: string` - Путь к файлу стилей компонента.
- `template: function` - Функция, возвращающая строку с HTML-разметкой компонента.

### `connectedCallback()`

Жизненный цикл кастомных элементов. Вызывается когда элемент вставляется в DOM. Вызывает `render()`.

### `styles()`

Возвращает стили компонента.

**Возвращает:** Строку с CSS-стилями.

### `onReady()`

Метод, вызываемый после рендеринга компонента. Используется для добавления функциональности или привязки обработчиков событий.

### `onAttributeChange(name, oldValue, newValue)`

Метод, вызываемый при изменении атрибутов компонента.

**Аргументы:**

- `name: string` - Имя атрибута.
- `oldValue: any` - Прежнее значение атрибута.
- `newValue: any` - Новое значение атрибута.

### `onDisconnect()`

Метод, вызываемый перед удалением элемента из DOM. Используется для очистки ресурсов или отписки от событий.

### `attributeChangedCallback(name, oldValue, newValue)`

Жизненный цикл кастомных элементов. Вызывается при изменении атрибута элемента.

### `disconnectedCallback()`

Жизненный цикл кастомных элементов. Вызывается перед удалением элемента из DOM.

### `render(...args)`

Очищает содержимое Shadow DOM и заполняет его новыми данными.

**Аргументы:**

- `...args: any` - Аргументы, которые будут переданы в функцию `template`.

## Статические свойства и методы

### `static attributes = {}`

Объект, содержащий атрибуты, которые необходимо отслеживать.

### `static get observedAttributes()`

Возвращает массив атрибутов, изменения которых необходимо отслеживать. Берет значения из объекта `attributes`.

# Использование [registry](./registry/README.md)
[Перейти к содержанию](#Содержание)

В приведенном примере кода показано использование `registry` - инструмента, позволяющего управлять регистрацией, конфигурацией и инициализацией кастомных элементов и сервисов в вашем приложении.

## Использование

```javascript
import {registry} from './registry/registry';
import {App} from './App';
import {PieChart} from './components/pie-chart/PieChart';
import {SERVICES} from './services/utils';
import {ChartDataService} from './services/ChartDataService';
import {ApiService} from './services/ApiService';
import {ConfigService} from './services/ConfigService';
import {LineChart} from './components/line-chart/LineChart';

registry()
    .resetCss()
    .register(App, PieChart, LineChart)
    .provideService(
        [SERVICES.ChartDataService, ChartDataService],
        [SERVICES.ApiService, ApiService],
        [SERVICES.ConfigService, ConfigService],
    )
    .init()
    .mount('#app', App);
```

## Методы

### `resetCss()`

Сбрасывает базовые стили CSS для всего приложения. Возвращает экземпляр реестра для дальнейшего вызова методов цепочкой.

### `register(...components)`

Регистрирует кастомные элементы, которые должны быть использованы в приложении.

**Аргументы:**

- `...components: Array<Class>` - Массив классов компонентов.

### `provideService(...services)`

Регистрирует сервисы, которые должны быть использованы в приложении.

**Аргументы:**

- `...services: Array<[string, Class]>` - Массив пар "ключ-класс" для сервисов.

### `init()`

Инициализирует реестр. Возвращает экземпляр реестра для дальнейшего вызова методов цепочкой.

### `mount(selector, component)`

Монтирует указанный кастомный элемент на страницу.

**Аргументы:**

- `selector: string` - CSS-селектор элемента, в котором должен быть проинициализирован кастомный элемент.
- `component: Class` - Класс кастомного элемента, который должен быть проинициализирован.

# Функция AppTemplate
[Перейти к содержанию](#Содержание)

`AppTemplate` - это функция, создающая шаблон HTML-страницы для приложения.

## Использование

```javascript
import {attributes, CHART_MAPPING} from './services/utils';

export function AppTemplate(...args) {
    return `
        <div class="root">
           <div class="charts">
                ${args?.reduce((result, [key, {type}]) => `${result}
                    <div class="chart-item">
                        <${CHART_MAPPING[type]} ${attributes.CHART_KEY}="${key}"> 
                    </div>`, '')}
           </div>
        </div>`;
}
```

## Методы

Функция `AppTemplate` принимает любое количество аргументов, которые впоследствии используются для создания частей шаблона.

Аргументы должны быть парами ключ-значение, где `key` - это ключ для атрибута `chart-key` в шаблоне, а `{type}` - это объект, содержащий тип диаграммы, который используется для выбора соответствующего названия кастомного элемента из списка `CHART_MAPPING`.

```javascript
args?.reduce((result, [key, {type}]) => `${result}
    <div class="chart-item">
        <${CHART_MAPPING[type]} ${attributes.CHART_KEY}="${key}"> 
    </div>`, '')
```

HTML-шаблон создается с помощью строкового литерала, и возвращает корневой div-элемент, который содержит div-элемент с классом `charts`, внутри которого создаются элементы для каждой пары ключ-значение, переданных в функцию.

## Пример использования

```javascript
const template = AppTemplate(['pie', {type: 'pie-chart'}], ['line', {type: 'line-chart'}]);
document.querySelector('.root').innerHTML = template;
```

В результате выполнения данного кода на странице будет создано два элемента: pie-chart и line-chart, каждый из которых будет помещен в свой div-элемент с классом `chart-item`, и атрибут `chart-key` каждого из этих элементов будет установлен в соответствии с переданными ключами.

# Класс App
[Перейти к содержанию](#Содержание)

Класс `App` используется как основной класс приложения. Он наследуется от `SandyElement`, управляет использованием различных сервисов и обрабатывает загрузку и обработку данных конфигураций диаграмм.

## Использование

```javascript
import {SandyElement} from './index';
import {AppTemplate} from './AppTemplate';
import AppStyles from './index.scss?inline';
import {SERVICES} from './services/utils';
import {inject} from '@/di/di';

export class App extends SandyElement {
    chartDataService;
    apiService;
    configService;

    constructor() {
        super(AppStyles, AppTemplate);
        this.chartDataService = inject(SERVICES.ChartDataService);
        this.apiService = inject(SERVICES.ApiService);
        this.configService = inject(SERVICES.ConfigService);

        this.prepareData()
            .then(console.log)
            .catch(console.error);
    }

    async prepareData() {
        try {
            const config = await this.configService.getChartsConfig();
            [...config.entries()].forEach(([key, config]) => this.chartDataService.setChartData(key, config))
            this.render(...config.entries())
        } catch (error) {
            throw new Error('Problem with config initialization.')
        }
    }
}
```

## Методы и Свойства

### `chartDataService`

Свойство, которое хранит ссылку на сервис `ChartDataService`.

### `apiService`

Свойство, которое хранит ссылку на сервис `ApiService`.

### `configService`

Свойство, которое хранит ссылку на сервис `ConfigService`.

### `constructor()`

Конструктор класса `App`. Делает инъекцию необходимых зависимостей и начинает подготовку данных.

### `async prepareData()`

Асинхронный метод, который получает данные конфигурации диаграммы, наборы данных для каждой из диаграмм и рендерит страницу. Если во время инициализации конфигурации возникает ошибка, метод генерирует исключение с сообщением об ошибке.
