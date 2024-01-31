export default {

    created() {
        // Do something on component creation
    },
    computed: {},
    methods: {
        copyValue(text) {
            let listener = function (ev) {
                ev.clipboardData.setData('text/plain', text);
                ev.preventDefault();
            };
            document.addEventListener('copy', listener);
            document.execCommand('copy');
            document.removeEventListener('copy', listener);
        }
    }
};
