import ToastService from 'primevue/toastservice'
import PrimeVue from "primevue/config"
import Ripple from 'primevue/ripple';
import Tooltip from 'primevue/tooltip'
import ConfirmationService from 'primevue/confirmationservice'


// Components
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import Card from 'primevue/card'
import InlineMessage from 'primevue/inlinemessage'
import Toast from 'primevue/toast'
import FileUpload from 'primevue/fileupload'
import Menubar from 'primevue/menubar'
import Paginator from 'primevue/paginator'
import DataView from 'primevue/dataview';
import MultiSelect from 'primevue/multiselect'
import Dropdown from 'primevue/dropdown'
import Chip from 'primevue/chip'
import Dialog from 'primevue/dialog'
import TabView from 'primevue/tabview'
import TabPanel from 'primevue/tabpanel'
import Fieldset from 'primevue/fieldset'
import Carousel from 'primevue/carousel'
import Divider from 'primevue/divider'
import Calendar from 'primevue/calendar'
import Textarea from 'primevue/textarea'
import InputNumber from 'primevue/inputnumber'
import InputSwitch from 'primevue/inputswitch'
import ConfirmDialog from 'primevue/confirmdialog'




export default function (app) {
    // Enable primeVue Services
    app.use(ToastService)
    app.use(ConfirmationService)
    app.use(PrimeVue, {ripple: true})

    // Directives
    app.directive('ripple', Ripple);
    app.directive('tooltip', Tooltip)

    // Add components
    app.component('InputText', InputText)
    app.component('Button', Button)
    app.component('Card', Card)
    app.component('InlineMessage', InlineMessage)
    app.component('Toast', Toast)
    app.component('FileUpload', FileUpload)
    app.component('MenuBar', Menubar)
    app.component('Paginator', Paginator)
    app.component('DataView', DataView)
    app.component('MultiSelect', MultiSelect)
    app.component('Dropdown', Dropdown)
    app.component('Chip', Chip)
    app.component('Dialog', Dialog)
    app.component('TabView', TabView)
    app.component('TabPanel', TabPanel)
    app.component('Fieldset', Fieldset)
    app.component('Carousel', Carousel)
    app.component('Divider', Divider)
    app.component('Calender', Calendar)
    app.component('Textarea', Textarea)
    app.component('InputNumber', InputNumber)
    app.component('InputSwitch', InputSwitch)
    app.component('ConfirmDialog', ConfirmDialog)
}