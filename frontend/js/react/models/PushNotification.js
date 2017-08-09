/**
 * это используется для пуш нотиф
 * убрал код с вьюхи
 */


export class PushNotification
{
    /**@private*/ OneSignal;

    init() {

        this.OneSignal = window.OneSignal || [];
        __DEV__&&console.log( 'this.OneSignal', this.OneSignal );
        // this.OneSignal.pushOneSignal();

    }

    pushOneSignal() {
        this.OneSignal.push(["init", {
            appId: "0730dc3f-a40a-4893-ae28-29b5e2455865",
            autoRegister: true, // Set to true to automatically prompt visitors /
            subdomainName: 'altbetsite',
            safari_web_id: 'web.onesignal.auto.39adc2cb-6008-498a-9928-7e19718d3b6a',
            httpPermissionRequest: {
                enable: true
            },
            notifyButton: {
                enable: true // Set to false to hide /
            }
        }]);
    }


    unSubscribeOneSignal() {
        this.OneSignal.setSubscription(false);
    }


    //callBack for Subscribed Users
    oneSignalCollback()
    {
        let userSubscribe;

        this.OneSignal.push(function () {
            // console.log('CALLBACK');

            this.OneSignal.on('subscriptionChange', function (isSubscribed) {
                userSubscribe = isSubscribed;
                if (isSubscribed) {
                    this.OneSignal.getUserId(function (userId) {
                        let data = {
                            'userName': globalData.userLogin,
                            'oneSignalId': userId,
                            'SubscribeOrNot': isSubscribed
                        };

                        $.ajax({
                            type: "POST",
                            //url: "https://s9prej0dhgdd.runscope.net/",
                            url: globalData.rootUrl + "Account/PushSubscribe",
                            data: data,
                            error: function () {
                                console.log('Error userName: ' + data.Name);
                                console.log('Error oneSignalId: ' + data.Id);
                            },
                            success: function () {
                                console.log('userName: ' + data.Name);
                                console.log('oneSignalId: ' + data.Id);
                                console.log('oneSignalId');
                            }

                        });
                    });
                }
            });
        });

        return userSubscribe;
    }


    subscribeOneSignal() {
        if (useragentid != null) {
            this.OneSignal.setSubscription(true);
        }
        else {
            this.OneSignal.registerForPushNotifications({
                modalPrompt: true
            });
        }
    }
}
