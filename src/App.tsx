import {SyntheticEvent, useCallback, useEffect, useState} from 'react';
import aviosLogo from './assets/avios-logo.png';
import baLogo from './assets/british-airways-logo.svg';
import './App.css';

function App() {
    const [airports, setAirports] = useState([]);
    const [depAirport, setDepAirport] = useState(null);
    const [arrAirport, setArrAirport] = useState(null);
    const [priceValue, setPriceValue] = useState(0);
    const [currencyType, setCurrencyType] = useState('GBP');
    const [routePricing, setRoutePricing] = useState(null);

    useEffect(() => {
        const fetchAirports = async() => {
            const res = await fetch('http://localhost:3000/api/airports');
            const data = await res.json();

            if(data.airports) {
                setAirports(data.airports);

                // Set fields to default values
                const firstAvailableOutputAirport = data.airports.find(airport => airport.outboundOnly === true);
                if(firstAvailableOutputAirport) {
                    setDepAirport(firstAvailableOutputAirport.code);
                }
            }
        };

        fetchAirports().catch(err => {
            console.error(`Fetching airports failed: ${err}`);
        });
    }, []);

    const onSearchClick = useCallback(() => {
        const params = {
            depAirport: String(depAirport),
            arrAirport: String(arrAirport),
            depTime: String(-1),
            arrTime: String(-1),
            price: String(priceValue),
            curr: String(currencyType),
        };

        console.warn('Params:', params, `priceValue: ${priceValue}`);

        const getPrices = async() => {

            const query = new URLSearchParams(params);

            const res = await fetch(`http://localhost:3000/api/calculatePrices?${query.toString()}`);
            const data = await res.json();
            setRoutePricing(data);
        };

        getPrices().catch(err => {
            console.error(`Get prices error: ${err}`);
        });
    }, [depAirport, arrAirport, priceValue, currencyType]);

    const onDepAirportChange = useCallback((event) => {
        setDepAirport(event.target.value);
    }, []);
    const onArrAirportChange = useCallback((event) => {
        setArrAirport(event.target.value);
    }, []);

    const onPriceInputChange = useCallback((event: SyntheticEvent<HTMLInputElement>) => {
        console.log(`new price: ${event.target.value}`);
        setPriceValue(event.target.value);
    }, []);

    const onCurrencyChange = useCallback((event) => {
        setCurrencyType(event.target.value);
    }, []);

    const airportsOutbound = airports.filter(airport => airport.outboundOnly);
    const airportsInbound = airports.filter(airport => airport.outboundOnly !== true);

    const currencies = [
        'GBP',
        'EUR',
    ];

    const isSubmitEnabled = depAirport && arrAirport && priceValue > 0;
    return (
        <>
            <div className='logoWrapper'>
                <img src={baLogo} className='logo--ba' alt='BA logo'/>
                <img src={aviosLogo} className='logo' alt='Avios logo'/>
            </div>
            <h2>Avios Price Calculator</h2>
            <div className='search'>
                {airports.length === 0 ? (
                    <div className='loader'>
                        Loading...
                    </div>) : (
                    <div className='searchForm'>
                        <div className='searchForm__field airportSelector airportSelector--from'>
                            <select name='airportOutbound' id='airportOutbound' onChange={onDepAirportChange}>
                                {airportsOutbound.map(airport => {
                                    return (
                                        <option key={airport.code} value={airport.code}>{airport.code}</option>
                                    );
                                })}
                            </select>
                        </div>
                        <div className='searchForm__field airportSelector airportSelector--to'>
                            <select name='airportInbound' id='airportInbound' onChange={onArrAirportChange}>
                                <option key='arrAirportDefaultValue' value='-'>-</option>
                                {airportsInbound.map(airport => {
                                    return (
                                        <option key={airport.code} value={airport.code}>{airport.code}</option>
                                    );
                                })}
                            </select>
                        </div>
                        <div className='searchForm__field price'>
                            <input value={priceValue} onChange={onPriceInputChange} />
                        </div>

                        <div className='searchForm__field currency'>
                            <select name='currencySelector' id='currencySelector' onChange={onCurrencyChange}>
                                {currencies.map(currency => {
                                    return (
                                        <option key={currency} value={currency}>{currency}</option>
                                    );
                                })}
                            </select>
                        </div>

                        <div className='searchButton'></div>
                        <button onClick={onSearchClick} disabled={!isSubmitEnabled}>
                            Calculate prices
                        </button>
                    </div>
                )}

                {routePricing && (
                    <div className='results'>

                        {routePricing.pricePoints.map((pricePoint) => {
                            return (
                                <div className='pricePoint' key={pricePoint.discountPercentage}>
                                    Full price: {routePricing.basePrice} {routePricing.currency}<br/>
                                    Discount: {pricePoint.discountPercentage * 100}%<br/>
                                    Cash: {pricePoint.cashPrice} {routePricing.currency}<br/>
                                    Avios: {pricePoint.aviosRequired}<br/>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </>
    );
}

export default App;
