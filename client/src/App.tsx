import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "./context/language-context";
import { ProgressProvider } from "./context/progress-context";
import Header from "./components/layout/header";
import Footer from "./components/layout/footer";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import BinaryBasics from "@/pages/binary-basics";
import IpAddresses from "@/pages/ip-addresses";
import SubnetMasks from "@/pages/subnet-masks";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/binary-basics" component={BinaryBasics} />
      <Route path="/ip-addresses" component={IpAddresses} />
      <Route path="/subnet-masks" component={SubnetMasks} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <ProgressProvider>
          <TooltipProvider>
            <div className="flex flex-col min-h-screen bg-gray-50 text-dark">
              <Header />
              <main className="flex-grow">
                <Router />
              </main>
              <Footer />
              <Toaster />
            </div>
          </TooltipProvider>
        </ProgressProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;
