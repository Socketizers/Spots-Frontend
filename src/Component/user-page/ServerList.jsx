// import React, { useEffect } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { getAllServers } from "../../features/server/serverSlice";
// import cookie from "react-cookies";

// function ServerList() {
//   const servers = useSelector((state) => state.server.servers);
//   const dispatcher = useDispatch();

//   useEffect(() => {
//     if (cookie.load("token")) dispatcher(getAllServers());
//   }, []);

//   return (
//     <div>
//       <ul>
//         {servers.map((server, index) => (
//           <li key={index}>{server.name}</li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// export default ServerList;
