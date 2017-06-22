declare const iziToast;

export class InfoMessages
{
    private initOpts = {
        id: '',
        "class": '',
        title: '',
        titleColor: '',
        titleSize: '',
        titleLineHeight: '',
        message: '',
        messageColor: '',
        messageSize: '',
        messageLineHeight: '',
        backgroundColor: '',
        color: '', // blue, red, green, yellow
        icon: '',
        iconText: '',
        iconColor: '',
        image: '',
        imageWidth: 50,
        maxWidth: null,
        zindex: null,
        layout: 1,
        balloon: false,
        close: true,
        rtl: false,
        position: 'bottomRight', //bottomLeft, topRight, topLeft, topCenter, bottomCenter, center
        target: '',
        targetFirst: true,
        timeout: 5000,
        drag: true,
        pauseOnHover: true,
        resetOnHover: false,
        progressBar: true,
        progressBarColor: '',
        animateInside: true,
        buttons: {},
        transitionIn: 'fadeInUp',
        transitionOut: 'fadeOut',
        transitionInMobile: 'fadeInUp',
        transitionOutMobile: 'fadeOutDown',
        onOpen: function () {},
        onClose: function () { },
    };


    public show(props: any)
    {
        props = {...this.initOpts, ...props};
        iziToast.show(props);
    }
}