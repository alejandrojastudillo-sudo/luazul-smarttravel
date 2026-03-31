# LUAZUL — Public Site (www.luazul.com)

## Entry Points

| File | URL | Description |
|------|-----|-------------|
| index.html | / | Landing page |
| ofertas.html | /paquetes | Package catalog |
| destinos.html | /destinos | Destinations map |
| empresa.html | /metodo | LUAZUL method |
| tours.html | /tours | Tours listing |
| simulador.html | /simulador | Payment simulator |
| panel_cliente_luazul.html | /mi-panel | Client portal |

## Demo Login for panel_cliente

```
email:    cliente_demo@luazul.com
password: demo123
```

## Dependencies

- `../shared/js/destinations.js` — LZ_DESTINATIONS data
- `../shared/js/weather.js` — weather data for destinos/
- `../shared/js/utilities.js` — lzToggle, LZ_UTILS
- `js/app.js` — local sliders and simulador
- `css/style.css`, `css/destinos-shared.css` — styles

## Security

- NO admin logic in this folder
- NO auth.js dependency
- Client panel uses separate `sessionStorage.luazul_session` (not lz_auth)
