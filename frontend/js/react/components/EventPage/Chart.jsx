/**
 * Created by Vlasakh on 20.11.16.
 */


export default class Chart extends React.Component
{
    constructor(props)
    {
        super();

        this.state = {data: props.data};
    }

    componentDidMount()
    {
		let self = this;
		// window.ee.addListener('myOpenOrder.update', function(newData)
		// {
		// 	// __DEV__&&console.debug( 'newData', newData );
         //    // let prevData = self.state.data;
         //    // newData = newData && newData.length ? positionControllerClass.filterData(newData, self.props.id) : [];
         //    newData = Object.assign(self.state.data, {openOrdersData: newData});
         //    self.setState(newData);
		// });
	}

    render()
    {
        // const { openOrdersData, positionData, historyData } = this.state.data;
        return <div className="todoapp">hello 11 </div>
    }
}

// if( __DEV__ )
// {
//     PageMyPos.propTypes = {
//         data: React.PropTypes.shape({
//             positionData: PropTypes.number.isRequired,
//             historyData: PropTypes.array.isRequired,
//         })
//     };
// } // endif
