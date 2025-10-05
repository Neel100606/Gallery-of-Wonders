import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FaPenNib, FaCameraRetro, FaBookOpen } from 'react-icons/fa';

const HomePage = () => {
  const { userInfo } = useSelector((state) => state.auth);

  const ctaLink = userInfo ? '/gallery' : '/register';
  const ctaText = userInfo ? 'Explore the Gallery' : 'Start Your Legacy';

  return (
    <div className="bg-slate-50 text-slate-800">
      {/* Hero Section */}
      <section className="relative text-white text-center py-24 sm:py-32">
        <div 
          className="absolute inset-0 bg-cover bg-center" 
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1579546929518-9e396f3a8034?q=80&w=2070')" }}
        >
          <div className="absolute inset-0 bg-black opacity-50"></div>
        </div>
        <div className="relative container mx-auto px-4">
          <h1 className="text-4xl sm:text-6xl font-extrabold mb-4 tracking-tight leading-tight">
            Preserving a Universe of Creativity
          </h1>
          <p className="text-lg sm:text-xl max-w-3xl mx-auto mb-8 text-slate-200">
            From fleeting performances to timeless masterpieces, the Gallery of Wonders is the permanent stage for every creator's legacy.
          </p>
          <Link
            to={ctaLink}
            className="bg-purple-600 text-white font-bold py-3 px-10 rounded-full text-lg hover:bg-purple-700 transition-all transform hover:scale-105 shadow-lg"
          >
            {ctaText}
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-2 text-slate-800">For Every Creator</h2>
          <p className="text-slate-500 mb-12 max-w-2xl mx-auto">Whether you paint with pixels, light, or words, your work has a home here.</p>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8">
              <FaCameraRetro className="text-5xl text-purple-600 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold mb-2">Photographers</h3>
              <p className="text-slate-600">
                Capture moments that last forever. Showcase your portfolio in stunning high-resolution.
              </p>
            </div>
            <div className="p-8">
              <FaPenNib className="text-5xl text-purple-600 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold mb-2">Artists & Designers</h3>
              <p className="text-slate-600">
                From digital paintings to traditional strokes, give your art the spotlight it deserves.
              </p>
            </div>
            <div className="p-8">
              <FaBookOpen className="text-5xl text-purple-600 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold mb-2">Writers & Poets</h3>
              <p className="text-slate-600">
                Immortalize your stories, poems, and thoughts in a space dedicated to the written word.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      {!userInfo && (
        <section className="bg-slate-800 py-20 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Your Stage Awaits.</h2>
            <p className="text-slate-300 max-w-2xl mx-auto mb-8">
              Join a community of passionate creators. It’s free to get started.
            </p>
            <Link
              to="/register"
              className="bg-white text-slate-800 font-bold py-3 px-10 rounded-full text-lg hover:bg-slate-200 transition-all transform hover:scale-105"
            >
              Create Account
            </Link>
          </div>
        </section>
      )}
    </div>
  );
};

export default HomePage;