import React, {PropTypes, Component} from 'react'

export default class Page extends Component {
    onYearBtnClick(e) {
        this.props.actions.getPhotos(+e.target.getAttribute('data-year'));
    }

    render() {
        const { year, photos, fetching, error } = this.props.data;
        const years = [2016,2015,2014,2013,2012,2011,2010];

        return <div className='ib page'>
            <p>
                { years.map((item, index) => <button className='btn' key={index} data-year={item}
                        onClick={::this.onYearBtnClick}>{item}</button>)}
            </p>
            <h3>{year} год [{photos.length}]</h3>
            { error ? <p className='error'> Во время загрузки фото произошла ошибка</p> : '' }
            {
                fetching ?
                    <p>Загрузка...</p>
                    :
                    photos.map((entry, index) =>
                        <div key={index} className='photo'>
                            <p><img src={entry.src}/></p>
                            <p>{entry.likes.count} ❤</p>
                        </div>
                    )
            }
        </div>
    }
}

if( __DEV__ )
{
    Page.propTypes = {
        data: React.PropTypes.shape({
            year: PropTypes.number.isRequired,
            photos: PropTypes.array.isRequired,
            error: PropTypes.string.isRequired,
        }),
        actions: React.PropTypes.shape({
            getPhotos: PropTypes.func.isRequired,
        }),
    };
} // endif
