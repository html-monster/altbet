import React from 'react';

export default class OrderForm extends React.Component{
	constructor()
	{
		super();
	}

	OnBeginAjax()
	{
		$(this.refs.orderForm).find('[type=submit]').attr('disabled', true);
	}

	onSuccessAjax()
	{
		console.log('Order sending finished: ' + this.props.data.ID);
	}

	onErrorAjax()
	{
		$(this.refs.orderForm).find('[type=submit]').removeAttr('disabled');
		defaultMethods.showError('The connection to the server has been lost. Please check your internet connection or try again.');
	}

	ajaxSendHandler(e)
	{
		e.preventDefault();
		defaultMethods.sendAjaxRequest({
			httpMethod: 'POST',
			url: this.props.formData.url,
			callback: ::this.onSuccessAjax,
			onError: ::this.onErrorAjax,
			beforeSend: ::this.OnBeginAjax,
			context: $(this.refs.orderForm)
		});
	}

	render()
	{
		let data = this.props.data;
		let formData = this.props.formData;
		let className = 'sell';

		if(data.isMirror){
			className = (data.isMirror) ?
					data.Side ? 'buy' : 'sell'
					:
					data.Side ? 'sell' : 'buy';
		}

		let html = <div>
			<div className="container">
				<div className="price">
					<label>Market price</label>
					<div className="input">
						<input className="number" data-validation="0.33" maxLength="4" name="LimitPrice" type="text" autoComplete="off" defaultValue={data.Price}/>
						<div className="warning" style={{display: 'none'}}><p>Available value from 0.01 to 0.99</p></div>
						<div className="regulator">
							<span className="plus" title="Press Arrow Up">{}</span>
							<span className="minus" title="Press Arrow Down">{}</span>
						</div>
					</div>
				</div>
				<div className="volume">
					<label>Quantity</label>
					<div className="input">
						<input className="number" data-validation="123" maxLength="7" name="Quantity" type="text" autoComplete="off" defaultValue={data.Volume}/>
						<div className="warning" style={{display: 'none'}}>
							<p>Available integer value more than 0</p>
						</div>
						<div className="regulator">
							<span className="plus" title="Press Arrow Up">{}</span>
							<span className="minus" title="Press Arrow Down">{}</span>
						</div>
					</div>
				</div>
				<div className="obligations">
					<label>Sum</label>
					<div className="input">
						<input type="text" className="number" data-validation="40.59" maxLength="7" autoComplete="off"/>
						<div className="warning" style={{display: 'none'}}><p>Minimal available value 0.01</p></div>
						<div className="regulator">
							<span className="plus" title="Press Arrow Up">{}</span>
							<span className="minus" title="Press Arrow Down">{}</span>
						</div>
					</div>
				</div>
			</div>
			<div className="container">
				<div className="fees">
					<label>
						<span>Max </span>Fees
						<div className="help">
							<div className="help_message right">
								<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>
							</div>
						</div>
					</label>
					<div className="input">
						<input type="text" className="number" autoComplete="off" disabled/>
					</div>
				</div>
				<div className="risk">
					<label>Max t.c.</label>
					<div className="input">
						<input type="text" className="number" autoComplete="off" disabled/>
					</div>
				</div>
				<div className="profit">
					<label>Max Prof.</label>
					<div className="input">
						<input type="text" className="number" autoComplete="off" disabled />
					</div>
				</div>
			</div>
			{data.ID ? <input name="ID" type="hidden" value={data.ID}/> : ''}
			<input name="Symbol" type="hidden" className="symbol" value={data.Symbol ? `${data.Symbol.Exchange}_${data.Symbol.Name}_${data.Symbol.Currency}` : ''}/>
			<input name="isMirror" type="hidden" className="mirror" value={data.isMirror}/>
			<input name="Side" type="hidden" className="side" value={(className)[0].toUpperCase() + (className).slice(1)}/>
			<div className="container">
				<div className="switch">
					<label className="checkbox">
						<input name="OrderType" type="checkbox" value="true" defaultChecked={true}/>
						<input name="OrderType" type="hidden" value="false"/>
						<span>Limit</span>
					</label>
				</div>
				<input type="submit" className={`btn ${className}`} value={className} style={{textTransform: 'uppercase'}}/>
				<span className="delete">{}</span>
			</div>
			<div className="error_pop_up">
				<span>The connection to the server has been lost. Please check your internet connection or try again.</span>
				<span className="close"><span>{}</span></span>
			</div>
		</div>;
		// data-ajax-begin="ajaxControllerClass.OnBeginJs" data-ajax-failure="ajaxControllerClass.OnFailureJs" data-ajax-success="ajaxControllerClass.OnSuccessJs"
		return (
				formData.action == 'create' ?
						<form action={formData.url} data-ajax-url={formData.url} data-ajax="true" data-ajax-begin="ajaxControllerClass.OnBeginJs" data-ajax-failure="ajaxControllerClass.OnFailureJs"
									data-ajax-success="ajaxControllerClass.OnSuccessJs" method="post" noValidate="novalidate">
							{html}
						</form>
						:
						<form action={formData.url} className={className} autoComplete="off" onSubmit={::this.ajaxSendHandler} method="post"
								noValidate="novalidate" ref="orderForm">
							{html}
						</form>
		)
	}
}