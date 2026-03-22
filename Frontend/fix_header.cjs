const fs = require('fs');

let content = fs.readFileSync('src/components/layout/Header.tsx', 'utf8');

// Remove the hardcoded fixed overlay
content = content.replace(/\{\/\* Click outside to close notifications \*\/\}[\s\S]*?\)\}/, '');

// Replace Notifications div part
const notificationsStart = content.indexOf('{/* Notifications */}');
const userDropdownStart = content.indexOf('{/* User Dropdown */}');

if (notificationsStart !== -1 && userDropdownStart !== -1) {
    const replacement = `{/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs font-semibold rounded-full flex items-center justify-center">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-96 p-0 overflow-hidden">
                <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">Notifications</h3>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                <div className="max-h-96 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                      <Bell className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p>No notifications yet</p>
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <DropdownMenuItem
                        key={notification.id}
                        onClick={() => markAsRead(notification.id)}
                        className={cn(
                          "p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors focus:bg-gray-50",
                          !notification.read && "bg-blue-50/50"
                        )}
                      >
                        <div className="flex items-start gap-3 w-full">
                          <div className={cn(
                            "w-2 h-2 rounded-full mt-2 flex-shrink-0",
                            !notification.read ? "bg-blue-500" : "bg-transparent"
                          )} />
                          <div className="flex-1 w-full">
                            <p className="font-medium text-sm text-gray-900">{notification.title}</p>
                            <p className="text-sm text-gray-600 mt-0.5 whitespace-normal">{notification.message}</p>
                            <p className="text-xs text-gray-400 mt-1">
                              {new Date(notification.createdAt).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </DropdownMenuItem>
                    ))
                  )}
                </div>

                <div className="p-3 border-t border-gray-200 bg-gray-50">
                  <Link
                    to="/notifications"
                    className="block text-center text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    View all notifications
                  </Link>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            `;
            
    const newContent = content.substring(0, notificationsStart) + replacement + content.substring(userDropdownStart);
    fs.writeFileSync('src/components/layout/Header.tsx', newContent);
    console.log("Header updated");
} else {
    console.log("Could not find ranges");
}