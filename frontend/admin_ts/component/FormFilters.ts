/**
 * Created on 30.12.2015.
 */


export class FormFilters {
    constructor() {
        var self = this;
    }


    /**
     * Place data-field-filter in DOM
     * Filters:
     *   digits: [symbols] - place symbols after colon or empty
     */
    public bindFiltersFn(context?) {
        var self = this;
        context = $(context);

        var items;
        if (context && context.length) items = context.find("[data-field-filter]");
        else items = $("[data-field-filter]");
        items.keypress(function (e) {
            self.onKeyPressFilterFn(e, this);
        });
    }


    private onKeyPressFilterFn(e, frmObj: HTMLInputElement) {
        var $that = $(frmObj);

        // get filters
        var params: any = $that.data('field-filter').split(';');
        var filters = {};
        for (var ii in params) {
            params[ii] = params[ii].replace("\\:", "|||");
            var val = params[ii].split(':', 2);
            val[1] && val[1].length && (val[1] = val[1].replace("|||", ":"));
            filters[val[0]] = val[1] ? val[1] : '';
        } // endfor

        // aplly filters
        for (var ii in filters) {
            if (ii == 'digits') {
                var additSymbols = filters[ii];
                if (e.which < 48 || e.which > 57) {
                    if (additSymbols &&
                        $.inArray(String.fromCharCode(e.which), additSymbols.split('')) !== -1 ||
                        $.inArray(e.keyCode, [8, 9, 46, 36, 35, 37, 39]) !== -1
                    ) {
                        return 1;
                    }
                    e.preventDefault();
                }
                else {

                } // endif
            }
            else if (ii == 'max') {
                if ($that.val().length >= filters[ii]) {
                    // if selecte - allow input
                    if (frmObj.selectionStart != frmObj.selectionEnd) return 1;
                    e.preventDefault();
                }
            } // endif
        } // endfor
    }
}