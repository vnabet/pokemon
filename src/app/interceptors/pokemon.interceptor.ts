import { HttpInterceptorFn } from '@angular/common/http';

export const pokemonInterceptor: HttpInterceptorFn = (req, next) => {

  // Si l'url de la requête ne commence pas par http ou https alors j'ajoute le préfixe https://pokeapi.co/api/v2
  if (!req.url.startsWith('http')) {
    const clonedRequest = req.clone({
      url: `https://pokeapi.co/api/v2/${req.url}`
    });
    return next(clonedRequest);
  }

  return next(req);
};
