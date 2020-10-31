import axios from 'axios';
import { baseURL } from '../Constants/NetworkingConstants';
// Universal fetch request using axios
// Only a fetch so far, can add post if needed
export default function universalFetch(
    setResponse,
    endpoint,
    onError,
    onSuccess
) {
    console.log('Fetch started');
    setResponse({
        data: null,
        loading: true,
        error: null,
    });
    axios
        .get(baseURL + endpoint)
        .then((resp) => {
            console.log('Response received');
            console.log(resp);
            setResponse({
                data: resp.data,
                loading: false,
                error: null,
            });
            onSuccess && onSuccess();
        })
        .catch((err) => {
            console.log(`Fetch failed with error ${err.message}`);
            setResponse({
                data: null,
                loading: false,
                error: err,
            });
            onError && onError();
        });
}
