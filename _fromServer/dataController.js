dataController = new function () {
    var maxPrice = 0;
    var minPrice = 1;
    var sellData, buyData;
    var headerData = {};

    this.updateHeaderData = function (data) {
        var profit = $('header .win-lost strong'),
            exposure = $('header .invested strong'),
            available = $('header .available strong');

        if (headerData.ex != data.Exposure) {
            exposure.text('$' + (data.Exposure).toFixed(2));
            headerData.ex = data.Exposure;
        }
        if (headerData.av != (data.Available).toFixed(2)) {
            available.text('$' + (data.Available).toFixed(2));
            headerData.av = data.Available;
        }
        if (headerData.pr != data.Profitlost) {
            headerData.pr = data.Profitlost;
            if (data.Profitlost < 0) {
                profit.text('($' + (data.Profitlost).toFixed(2).toString().replace('-', '') + ')');
                profit.removeClass('win').addClass('lost');
            }
            else if(data.Profitlost == 0){
                profit.text('$' + (data.Profitlost).toFixed(2) + '');
                profit.removeClass('lost win');
            }
            else {
                profit.text('$' + (data.Profitlost).toFixed(2) + '');
                profit.removeClass('lost').addClass('win');
            }
        }
    }

    this.updateOrderData = function (data) {
        $(data).each(function () {
            setData(this, 'buy', 'BID', 'real');
            setData(this, 'sell', 'OFFER', 'real');
            setData(this, 'buy', 'OFFER', 'mirror');
            setData(this, 'sell', 'BID', 'mirror');
        });
    }

    var setData = function (data, side, emptyCaption, real) {
        var containerSide = (real == 'real'
            ? side
            : side == 'buy' ? 'sell' : 'buy');

        var id = data.Symbol.Exchange + '_' + data.Symbol.Name + '_' + data.Symbol.Currency + (real == 'real' ? '' : '_mirror');
        var event = $('[data-symbol=' + id + ']');
        var container = event.find('div.' + containerSide + '.button-container');

        if(!event[0].tagData) event[0].tagData = {};

        if (data.Orders.length == 0) {
            // var emptyButton = createEmptyButton(id, containerSide, emptyCaption, real, container);
            // container.children().remove();
            // container.append(emptyButton);
            //container.children().replaceWith(emptyButton);
            createEmptyButton(id, containerSide, emptyCaption, real, container);
            if(data.Invested) event.find('.mode_info_js strong').css('marginTop', -25);
        }
        else {
            var sellOrders = null;
            var buyOrders = null;
            $(data.Orders).each(function () {
                if (this.Side == 0)
                    sellOrders = this;
                if (this.Side == 1)
                    buyOrders = this;
            });

            var orders = side == 'buy' ? buyOrders : sellOrders;
            if (orders != null) {
                // var priceButtons = createButtons(orders, id, containerSide, real, container);
                createButtons(orders, id, containerSide, real, container);
                // container.children().remove();
                // $(priceButtons).each(function () {
                //     container.append(this);
                // });
            }
            else {
                createEmptyButton(id, containerSide, emptyCaption, real, container);
                // var emptyButton = createEmptyButton(id, containerSide, emptyCaption, real, container);
                // container.children().remove();
                // container.append(emptyButton);
            }
            // console.log(data);
            if(data && globalData.userIdentity === 'True'){
                // console.log(event.tagData.Positions);
                // console.log(data.Positions);
                if(event[0].tagData.Positions !== data.Positions){
                    // console.log(event[0].tagData);
                    event.find('.pos span').text(data.Positions);
                    event[0].tagData.Positions = data.Positions ;
                    // console.log(event[0].tagData);
                }
                if(event[0].tagData.GainLoss !== data.GainLoss){
                    if(data.GainLoss < 0)
                        event.find('.pl span').removeClass('win').addClass('lose').text('($' + (data.GainLoss).toFixed(2).toString().slice(1) + ')');
                    else if(data.GainLoss === 0)
                        event.find('.pl span').removeClass('lose win').text('$' + (data.GainLoss).toFixed(2));
                    else
                        event.find('.pl span').removeClass('lose').addClass('win').text('$' + (data.GainLoss).toFixed(2));


                    event[0].tagData.GainLoss = data.GainLoss ;
                }
                if(data.Invested) event.find('.mode_info_js strong').css('marginTop', 3);
            }
            // console.log('===============================');
        }
    }

    var createEmptyButton = function (symbolId, side, caption, real, container) {
        var disebled = ($('.trader input').prop('checked')) ? '"disabled", "true"' : '',
            ii = 1;

        container.find('button').addClass('empty').attr(disebled);
        container.find('.volume').remove();
        if (container.find('button .price').text() !== caption) container.find('button').addClass('fadeOut').find('.price').text(caption);

        container.find('button').each(function () {
            if ($(this).index() !== 0) $(this).remove();
        });

        setTimeout(function () {
            container.find('.fadeOut').removeClass('fadeOut');
        }, 500);
        // var spanObject = $('<span/>', {
        //     text: caption,
        //     class: 'price empty'
        // });
        //
        // var divObject = $('<div/>', {
        //     class: 'symbolName',
        //     style: 'display: none',
        //     text: symbolId
        // });
        //
        // var buttonObject = $('<button/>',
        // {
        //     class: 'event empty ' + side + ' ' + real,
        // }).append(spanObject).append(divObject);
        //
        // return buttonObject;
    }

    var createButtons = function (data, symbolId, side, real, container) {
        // var buttons = [];

        if (real === 'mirror') {
            data.SummaryPositionPrice.reverse();
        }

        // $(data.SummaryPositionPrice).each(function () {
        //     console.log(this);
        //     var spanPriceObject = $('<span/>', {
        //         text: (real == 'real' ? this.Price.toFixed(2) : (1 - this.Price).toFixed(2)),
        //         class: 'price'
        //     });
        //
        //     var spanVolumeObject = $('<span/>', {
        //         text: this.Quantity.toString(),
        //         class: 'volume'
        //     });
        //
        //     var divObject = $('<div/>', {
        //         class: 'symbolName',
        //         style: 'display: none',
        //         text: symbolId
        //     });
        //
        //     var buttonObject = $('<button/>',
        //     {
        //         class: 'event ' + side + ' ' + (real == 'real' ? '' : ' mirror')
        //     }).append(spanPriceObject).append(spanVolumeObject).append(divObject);
        //
        //     buttons.push(buttonObject)
        // });
        var children = container.children().length,
            objLength = data.SummaryPositionPrice.length,
            flag = 0,
            disebled = ($('.trader input').prop('checked')) ? 'disabled' : '',
            html = '<button class="event animated ' + side + ' ' + (real === 'real' ? '' : ' mirror') + '" ' +
                    disebled + '><span class="price"></span><span class="volume"></span><div class="symbolName" style="display: none">' +
                    symbolId + '</div></button>';

        // container.find('button span').text('');

        if (children > objLength) {
            container.find('button').each(function () {
                if ($(this).index() >= objLength) $(this).remove();
                if (side == 'sell') {
                    container.find('button').addClass('fadeOut');
                }
            });
        }
        if (children < objLength) {
            if (side == 'sell') {
                for (var ii = children; ii < objLength; ii++) {
                    container.prepend(html);
                }
            }
            else {
                for (var ii = children; ii < objLength; ii++) {
                    container.append(html);
                }
            }
        }
        $(data.SummaryPositionPrice).each(function () {
            var self = this,
                button = container.find('button').eq(flag++),
                price;


            self.Price = (real == "real") ? self.Price : (1 - self.Price);
            price = ($('.mode_switch input').prop('checked')) ? self.Price.toFixed(2) : '$' + self.Price.toFixed(2);
            if ((button.find('.price').text()).replace('$', '') !== self.Price.toFixed(2) ||
                button.find('.volume').text() !== self.Quantity) {

                button.addClass('fadeOut').find('.price').text(price);
                if (button.find('.volume').length)
                    button.find('.volume').text(self.Quantity);
                else
                    button.removeClass('empty').append('<span class="volume">' + self.Quantity + '</span>');
            }
        });
        setTimeout(function () {
            container.find('.fadeOut').removeClass('fadeOut');
        }, 500);

        // function compareData(data){
        //     $(data).each(function () {
        //         $(data.SummaryPositionPrice).each(function () {
        //             var self = this;
        //             container.find('button').each(function () {
        //                 // console.log(self.Price.toFixed(2));
        //                 // console.log($(this).find('.price').text());
        //                 if($(this).find('.price').text() == self.Price.toFixed(2) &&
        //                     $(this).find('.volume').text() == self.Quantity)
        //                 {
        //                     $(this).addClass('old');
        //                 }
        //             });
        //         });
        //     });
        //     container.find('button:not(.old)').addClass('fadeOut');
        //     setTimeout(function () {
        //         container.find('.fadeOut').removeClass('fadeOut');
        //     }, 500);
        // }
        // if(side == 'sell'){
        //     if(sellData) compareData(sellData);
        //     sellData = data;
        // }
        // else{
        //     if(buyData) compareData(buyData);
        //     buyData = data;
        // }
        // console.log('=======================');
        //         return buttons;
    }


    // BM: update event page data from socket (TODEL после окончания EventPage)
    this.updateEventData = function (activeOrders, bars) {
        if (bars == null) return;

        maxPrice = 0;
        minPrice = 1;

        $('div[id^="eventContainer_"]').each(function () {
            var identificator = $(this).attr('id').replace('eventContainer_', '');

            var data = null;
            var ticks = null;

            $(activeOrders).each(function (index, value) {
                if (this.Symbol.Exchange + '_' + this.Symbol.Name + '_' + this.Symbol.Currency === identificator) {
                    data = value;
                    ticks = bars[index];
                }
            });

            $(bars).each(function () {
                if (this.Symbol.Exchange + '_' + this.Symbol.Name + '_' + this.Symbol.Currency === identificator) {
                    ticks = this;
                }
            });

            if (data != null && data.Orders.length !== 0) {
                var buyIndex = 0;
                var sellIndex = 1;
                if (data.Orders[0].Side === 1) {
                    buyIndex = 1;
                    sellIndex = 0;
                }

                // BM: TODEL после окончания EventPage
                // setEventTableData(data.Orders[buyIndex], 'buy');
                // setEventTableData(data.Orders[sellIndex], 'sell');
            }
            else {
                // $('.executed_orders.order_create table tbody').html('');
            }

            if (ticks != null)
                setTicksTableData(ticks);
        });
    }

    var setTicksTableData = function (data)
    {
        return; // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        var isMirror = $('input[type=hidden]#IsMirror').val();

        $(data).each(function () {
            var tickTable = $('div.executed_orders table tbody').last();
            tickTable.children().remove();

            $(data.Ticks.reverse()).each(function () {
                var date = new Date(this.Time.replace('/Date(', '').replace(')/', '') * 1);

                var tdIdObject = ($('<td/>'))
                    .append($('<span/>', {
                        text: (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear() + ' ' + date.getHours() +
                        ':' + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':' +
                        (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds())
                    }));
                /*var tdIdObject = ($('<td/>'))
                    .append($('<span/>', {
                        class: 'timestamp help'
                    }));

                tdIdObject.find('.timestamp')
                          .html($('<span/>', {
                              text: (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear() + ' ' + date.getHours() +
                              ':' + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':' +
                              (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds())
                          }))
                          .append($('<span/>', {
                              class: 'help_message',
                              html: '<strong>MM/DD/YYYY | HH:MM</strong>'
                          }));*/

                var side = this.Side ? 'sell' : 'buy';

                var price = ((isMirror == 'True') ? (1 - this.Open).toFixed(2) : this.Open.toFixed(2));

                if (price > maxPrice) maxPrice = price;
                if (price < minPrice) minPrice = price;


                var tdPriceObject = ($('<td/>', {
                    class: ' price ' + side
                }))
                    .append($('<span/>', {
                        text: '$' + price
                    }));

                var tdVolumeObject = ($('<td/>', {
                    class: ' volume ' + side
                }))
                    .append($('<span/>', {
                        text: this.Volume
                    }));

                var trObject = $('<tr>').append(tdIdObject).append(tdPriceObject).append(tdVolumeObject);
                tickTable.append(trObject);
            });
        });

        $('.high.container span.current').text((+maxPrice).toFixed(2));
        $('.low.container span.current').text((+minPrice).toFixed(2));
    }



    /**
     * установка кликов на ставки на EventPage
     * @deprecated
     */
    var setEventTableData = function (data, side)
    { 
/*
        var isMirror = $('input[type=hidden]#IsMirror').val();

        if (isMirror == 'True') {
            side = side == 'buy' ? side = 'sell' : side = 'buy';
        };

        // console.log(data);
        var table = $('div.executed_orders.' + (side == 'sell' ? 'buy' : 'sell') + '.order_create table tbody');


        if (!$('.left_order .tab input.limit').prop('checked'))
            var className = 'clickable';
        else
            var className = '';

        if (!data) table.html('');
        table.find('.old').removeClass('old');
        $(data).each(function () {

            //var isMirror = $('input[type=hidden]#IsMirror').val();

            if (isMirror == 'True' && side == 'sell') data.SummaryPositionPrice.reverse();
            if (isMirror == 'False' && side == 'buy') data.SummaryPositionPrice.reverse();

            //     table.html('');
            //
            //     $(data.SummaryPositionPrice).each(function () {
            //         var self = this;
            //
            //         self.Price = (isMirror == "True") ? (1 - self.Price) : self.Price;
            //
            //         if (self.Price > maxPrice) maxPrice = self.Price;
            //         if (self.Price < minPrice) minPrice = self.Price;
            //
            //         var tdIdObject = ($('<td>'))
            //             .append($('<span>', {
            //                 text: 'alt.bet'
            //             }));
            //
            //         var tdPriceObject = ($('<td>', {
            //             class: className + ' price ' + side
            //         }))
            //             .append($('<span>', {
            //                 text: '$' + self.Price.toFixed(2)
            //             }));
            //
            //         var tdVolumeObject = ($('<td>', {
            //             class: className + ' volume ' + side
            //         }))
            //             .append($('<span>', {
            //                 text: self.Quantity
            //             }));
            //
            //         var trObject = $('<tr>').append(tdIdObject).append(tdPriceObject).append(tdVolumeObject);
            //         table.append(trObject);
            //     });
            // }
            var children = table.children().length,
                objLength = data.SummaryPositionPrice.length,
                flag = 0;

            table.find('tr td:not(:first-of-type) span').text('');

            if(table.children().length == 0) className += ' fadeColorOut';

            if (children > objLength) {
                table.find('tr').each(function () {
                    if ($(this).index() >= objLength) $(this).remove();
                });
            }
            if (children < objLength) {
                for (var ii = children; ii < objLength; ii++) {
                    table.append('<tr><td><span>alt.bet</span></td><td class="' + className + ' price ' + side +
                        ' animated"><span></span></td><td class="' + className + ' volume ' + side + ' animated"><span></span></td></tr>');
                }
            }
            $(data.SummaryPositionPrice).each(function () {
                var self = this;
                var tr = table.find('tr').eq(flag++);

                self.Price = (isMirror == "True") ? (1 - self.Price) : self.Price;

                //if (self.Price > maxPrice) maxPrice = self.Price;
                //if (self.Price < minPrice) minPrice = self.Price;

                tr.find('.price span').text('$' + self.Price.toFixed(2));
                tr.find('.volume span').text(self.Quantity);
            });

            //$('.high.container span.current').text(maxPrice.toFixed(2));
            //$('.low.container span.current').text(minPrice.toFixed(2));
        });

        function compareData(data) {
            $(data).each(function () {
                $(data.SummaryPositionPrice).each(function () {
                    var self = this;
                    table.find('tr').each(function () {
                        if ($(this).find('.price span').text() == '$' + self.Price.toFixed(2) &&
                            $(this).find('.volume span').text() == self.Quantity) {
                            $(this).addClass('old');
                        }
                    });
                });
            });
            table.find('tr:not(.old) .volume').addClass('fadeColorOut');
            table.find('tr:not(.old) .price').addClass('fadeColorOut');
            setTimeout(function () {
                table.find('.fadeColorOut').removeClass('fadeColorOut');
            }, 500);
        }
        if (side == 'sell') {
            if (sellData) compareData(sellData);
            sellData = data;
        }
        else {
            if (buyData) compareData(buyData);
            buyData = data;
        }
*/
    }

    /*this.updateActiveTraiderData = function (data) {
        if ($('div[id^="trader_"]').attr('id') == null) return;

        var identificators = $('div[id^="trader_"]').attr('id').replace('trader_', '').split('_');

        var activeData = null;

        $(data).each(function () {
            if (this.Symbol.Exchange == identificators[0]
                && this.Symbol.Name == identificators[1]
                && this.Symbol.Currency == identificators[2])
            {
                activeData = this;
            }
        });

        $(activeData).each(function () {
            $(this.Orders).each(function () {
                var lines = $('tr.visible');

                var side = this.Side;
                $(this.SummaryPositionPrice).each(function () {
                    price = '$' + this.Price;
                    volume = this.Quantity;
                    userVolume = this.ParticularUserQuantity;

                    var line = null;

                    $(lines).each(function () {
                        if ($(this).find('td.price_value span.value').text() == price)
                        {
                            line = this;
                        }
                    });

                    if (side == 0) {
                        $(line).find('td.sell span.value').text(volume);
                        $(line).find('td.my_bids.my_size span.value').first().text(userVolume);
                    }
                    else {
                        $(line).find('td.buy span.value').text(volume)
                        $(line).find('td.my_offers.my_size span.value').last().text(userVolume);
                    }
                });
            });
        });
    }*/


}