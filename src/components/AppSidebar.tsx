import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { 
  Home, 
  Package, 
  Users, 
  ArrowRight, 
  BarChart3,
  Video,
  User,
  LogOut,
  Lock
} from "lucide-react";
import { useLocation, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useAdminCheck } from "@/hooks/useAdminCheck";
import { useToast } from "@/hooks/use-toast";

const menuItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
    adminOnly: false,
  },
  {
    title: "Equipamentos",
    url: "/equipamentos",
    icon: Package,
    adminOnly: false,
  },
  {
    title: "Check-in/Check-out",
    url: "/checkin",
    icon: ArrowRight,
    adminOnly: false,
  },
  {
    title: "Usuários",
    url: "/usuarios",
    icon: Users,
    adminOnly: true,
  },
  {
    title: "Relatórios",
    url: "/relatorios",
    icon: BarChart3,
    adminOnly: false,
  },
  {
    title: "Perfil",
    url: "/profile",
    icon: User,
    adminOnly: false,
  },
];

export function AppSidebar() {
  const location = useLocation();
  const { user, signOut } = useAuth();
  const { isAdmin } = useAdminCheck();
  const { toast } = useToast();

  const handleLogout = async () => {
    const { error } = await signOut();
    if (error) {
      toast({
        title: "Erro ao sair",
        description: error.message,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso."
      });
    }
  };

  const getUserDisplayName = () => {
    return user?.user_metadata?.name || user?.email?.split('@')[0] || 'Usuário';
  };

  const getUserInitials = () => {
    const name = user?.user_metadata?.name || user?.email || '';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <Sidebar className="border-r border-sidebar-border">
      <SidebarHeader className="p-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
            <Video className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-sidebar-foreground">VideoControl</h1>
            <p className="text-sm text-sidebar-foreground/60">Gestão de Equipamentos</p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild={!item.adminOnly || isAdmin}
                    isActive={location.pathname === item.url}
                    className="hover:bg-sidebar-accent transition-colors"
                    disabled={item.adminOnly && !isAdmin}
                  >
                    {item.adminOnly && !isAdmin ? (
                      <div className="flex items-center gap-2 opacity-50 cursor-not-allowed">
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                        <Lock className="h-3 w-3 ml-auto" />
                      </div>
                    ) : (
                      <Link to={item.url}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="p-4 space-y-2">
        <div className="flex items-center gap-3 p-2 rounded-lg bg-sidebar-accent">
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
            <span className="text-xs font-semibold text-primary-foreground">
              {getUserInitials()}
            </span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-sidebar-foreground">{getUserDisplayName()}</p>
            <p className="text-xs text-sidebar-foreground/60">{user?.email}</p>
            {isAdmin && (
              <p className="text-xs text-primary font-medium">Admin</p>
            )}
          </div>
        </div>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleLogout}
          className="w-full"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sair
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
