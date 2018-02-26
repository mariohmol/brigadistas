import { BrigadeRoutes } from "./brigade/brigade.routing";
import { UserRoutes } from "./user/user.routing";
import { ChatRoutes } from "./chat/chat.routing";
import { FireRoutes } from "./fire/fire.routing";
import { GeoRoutes } from "./geo/geo.routing";
import { MessageRoutes } from "./message/message.routing";


export const AppRoutes = [
    ...BrigadeRoutes,
    ...ChatRoutes,
    ...FireRoutes,
    ...GeoRoutes,
    ...MessageRoutes,
    ...UserRoutes
];
