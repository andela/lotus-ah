// THIRD-PARTY LIBRARY
import { Router } from 'express';

// modules import
import SearchController from '../../controllers/SearchController';

const SearchRoutes = Router();

// Route for search
SearchRoutes.get('/search/author/:author', SearchController.searchAuthor);
SearchRoutes.get('/search/tag/:name', SearchController.searchTag);
SearchRoutes.get('/search/article/:keyword', SearchController.searchArticle);

export default SearchRoutes;
