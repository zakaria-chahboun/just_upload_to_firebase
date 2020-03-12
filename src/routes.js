import Home from "./Home.svelte";
import Types from "./Types.svelte";


const routes = [{
        name: '/',
        component: Home
    },
    {
        name: 'types',
        component: Types
    }
]


export {
    routes
};