import { Footer } from "antd/es/layout/layout";
import { Navigate, Route, Routes as RouterDomRoutes } from 'react-router-dom';
import { BottomNavigation } from "../components/bottomNavigation.component";
import { ProtectedRoute } from "../components/protectedRoute.component";
import { ROUTES } from '../configs/app.constants';
import { CourierFaq } from "../screens/courierFaq.screen";
import { CreateScreen } from "../screens/create.screen";
import { CustomerFaqScreen } from "../screens/customerFaq.screen";
import { ListScreen } from "../screens/list.screen";
import { LoginScreen } from "../screens/login.screen";
import { OrderScreen } from "../screens/order.screen";
import { PrivacyPolicyScreen } from "../screens/privacyPolicy.screen";
import { SettingsScreen } from "../screens/settings.screen";
import { TermsAndConditionsScreen } from "../screens/termsAndConditions.screen";
import { UserRoleEnum } from '../store/reducers/backend/backend.api.types';

function AppRoutes({isAuth, pathname = ''}) {
    return (
        <>
            <RouterDomRoutes>
                {
                    !isAuth && <>
                        {/* <Route path={ROUTES.START} element={<StartScreen/>}/> */}
                        <Route path={ROUTES.LOGIN.PATH + ROUTES.LOGIN.PARAMS}
                               element={<LoginScreen/>}/>
                    </>
                }
                <Route path={ROUTES.CREATE_ORDER} element={<CreateScreen/>}/>
                <Route path={ROUTES.PRIVACY_POLICY} element={<PrivacyPolicyScreen/>}/>
                <Route path={ROUTES.TERMS_AND_CONDITIONS} element={<TermsAndConditionsScreen/>}/>
                <Route path={ROUTES.COURIER_FAQ} element={<CourierFaq/>}/>
                <Route path={ROUTES.CUSTOMER_FAQ} element={<CustomerFaqScreen/>}/>
                {/* <Route path={ROUTES.CHECKOUT}
                       element={
                           <ProtectedRoute auth={isAuth}>
                               <CheckoutScreen/>
                           </ProtectedRoute>
                       }
                /> */}
                <Route path={ROUTES.LIST_ORDERS}
                       element={
                           <ProtectedRoute auth={isAuth}>
                               <ListScreen/>
                           </ProtectedRoute>
                       }
                />
                <Route path={ROUTES.ORDER.PATH + ROUTES.ORDER.PARAMS}
                       element={
                           <ProtectedRoute auth={isAuth}>
                               <OrderScreen/>
                           </ProtectedRoute>
                       }
                />
                <Route path={ROUTES.UPDATE_ORDER.PATH + ROUTES.UPDATE_ORDER.PARAMS}
                       element={
                           <ProtectedRoute auth={isAuth}>
                               <CreateScreen/>
                           </ProtectedRoute>
                       }
                />
                <Route path={ROUTES.SETTINGS}
                       element={
                           <ProtectedRoute auth={isAuth}>
                               <SettingsScreen/>
                           </ProtectedRoute>
                       }
                />
                <Route path="*"
                       element={
                           <Navigate to={
                               isAuth ?
                                   ROUTES.LIST_ORDERS :
                                   ROUTES.LOGIN.PATH + '/' + UserRoleEnum.Customer
                           } replace/>
                       }
                />
            </RouterDomRoutes>
            {
                (pathname === ROUTES.LIST_ORDERS ||
                    pathname === ROUTES.CREATE_ORDER ||
                    pathname === ROUTES.SETTINGS)
                && isAuth &&
                <Footer>
                    <BottomNavigation/>
                </Footer>
            }

        </>
    );
}

export default AppRoutes;
