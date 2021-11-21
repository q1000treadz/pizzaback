import { Application } from 'express';
import CatalogRoutes from './catalogRoutes';
import UsersRoutes from './usersRoutes';
import PizzeriasRoutes from './pizzeriasRoutes';
import OrdersRoutes from './ordersRoutes';

class Routes {
  public routes(app : Application): void {
    new CatalogRoutes().routes(app);
    new UsersRoutes().routes(app);
    new PizzeriasRoutes().routes(app);
    new OrdersRoutes().routes(app);
  }
}

export default Routes;
