module.exports = (app) => {
    /**
     * Returns available outbound and destination airports
     */
    app.get('/api/airports', (req, res) => {
        res.json({
            airports: [
                {
                    code: 'LHR',
                    outboundOnly: true,
                },
                {
                    code: 'LGW',
                    outboundOnly: true,
                },
                {
                    code: 'LAX',
                },
                {
                    code: 'AMS',
                },
                {
                    code: 'JFK',
                },
                {
                    code: 'MUC',
                },
            ]
        });
    });

    /**
     * Generates price points for given flight route and price/currency
     */
    app.get('/api/calculatePrices', (req, res) => {
        const depAirportCode = req.query.depAirport;
        const arrAirportCode = req.query.arrAirport;
        const depTime = req.query.depTime;
        const arrTime = req.query.arrTime;
        const basePrice = Number.parseFloat(req.query.price);
        const currency = req.query.curr;

        /*-------------------------------------------------------------
            Validation of params
        -------------------------------------------------------------*/
        // TODO: Implement validation of submitted params

        /*-------------------------------------------------------------
            Predetermined Avios values
        -------------------------------------------------------------*/
        const aviosDefaultValue = 0.02;
        const aviosValuePerRouteMap = [
            {
                departureAirportCode: 'LHR',
                arrivalAirportCode: 'LAX',
                valuePerAvios: 0.028
            },
            {
                departureAirportCode: 'LHR',
                arrivalAirportCode: 'AMS',
                valuePerAvios: 0.025
            },
            {
                departureAirportCode: 'LHR',
                arrivalAirportCode: 'JFK',
                valuePerAvios: 0.03
            },
            {
                departureAirportCode: 'LGW',
                arrivalAirportCode: 'LAX',
                valuePerAvios: 0.027
            },
            {
                departureAirportCode: 'LGW',
                arrivalAirportCode: 'MUC',
                valuePerAvios: 0.024
            },
        ];

        // Figure out matching route etc.
        const matchingAviosRoute = aviosValuePerRouteMap.find(route => route.departureAirportCode === depAirportCode && route.arrivalAirportCode === arrAirportCode);
        const aviosValueForRoute = matchingAviosRoute?.valuePerAvios ?? aviosDefaultValue;

        const discountPoints = [
            0,
            0.2,
            0.5,
            0.7,
            1.0
        ];

        // Generate response with price points
        res.json({
            departureAirportCode: depAirportCode,
            arrivalAirportCode: arrAirportCode,
            depTime: depTime,
            arrTime: arrTime,
            departureTime: -1, // Not used
            arrivalTime: -1,  // Not used
            valuePerAvios: aviosValueForRoute,
            currency: currency,
            basePrice: basePrice,
            pricePoints: discountPoints.map(discount => {
                const cashPrice = basePrice - basePrice * discount;
                const cashPriceRounded = Number(`${Math.round(`${cashPrice}e2`)}e-2`).toFixed(2);
                return {
                    discountPercentage: discount,
                    cashPrice: cashPriceRounded,
                    aviosRequired: Math.ceil((basePrice * discount) / aviosValueForRoute),
                };
            }),
        });
    });
};
