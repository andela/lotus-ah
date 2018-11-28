// THIRD-PARTY LIBRARY
import { Router } from 'express';

// modules import
import SearchController from '../../controllers/SearchController';

const SearchRoutes = Router();

// Route for search
SearchRoutes.get('/search/author/:author', SearchController.searchArticleByAuthor);
SearchRoutes.get('/search/tag/:name', SearchController.searchArticleByTagName);
SearchRoutes.get('/search/article/:keyword', SearchController.searchArticleByKeyword);

export default SearchRoutes;
