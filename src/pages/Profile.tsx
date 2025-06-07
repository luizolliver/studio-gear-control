
import { Layout } from "@/components/Layout";
import { UserProfile } from "@/components/UserProfile";

export default function Profile() {
  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold">Perfil</h1>
          <p className="text-muted-foreground">Gerencie suas informações pessoais</p>
        </div>

        <div className="max-w-2xl">
          <UserProfile />
        </div>
      </div>
    </Layout>
  );
}
