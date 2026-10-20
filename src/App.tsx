import {AppScreens} from './components/AppScreens';
import {Faq} from './components/Faq';
import {Features} from './components/Features';
import {FinalDownload} from './components/FinalDownload';
import {Footer} from './components/Footer';
import {Header} from './components/Header';
import {Hero} from './components/Hero';
import {Install} from './components/Install';
import {LeaveDemo} from './components/LeaveDemo';
import {Updates} from './components/Updates';

export default function App() {
  return (
    <div id="top">
      <Header />
      <main>
        <Hero />
        <AppScreens />
        <Features />
        <LeaveDemo />
        <Install />
        <Updates />
        <Faq />
        <FinalDownload />
      </main>
      <Footer />
    </div>
  );
}
