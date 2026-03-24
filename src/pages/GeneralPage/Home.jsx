import React, { useEffect } from 'react';
import Header from '../../components/Layout/Header';
import Footer from '../../components/Layout/Footer';
import landingImage from '../../assets/home/landing-img.png';
import homeImage1 from '../../assets/home/home-img-1.png';
import homeImage1Sub1 from '../../assets/home/home-img-1.1.png';
import homeImage1Sub2 from '../../assets/home/home-img-1.2.png';
import homeImage2 from '../../assets/home/home-img-2.png';
import homeImage2Sub1 from '../../assets/home/home-img-2.1.png';
import homeImage2Sub2 from '../../assets/home/home-img-2.2.png';
import homeImage3 from '../../assets/home/home-img-3.png';
import AOS from 'aos';
import 'aos/dist/aos.css';
import HomeToFlashcardButton from '../../components/Button/HomeToFlashcardButton';

function Home() {
  useEffect(() => {
    // Wait for window load event to ensure all content is ready
    const handleLoad = () => {
      AOS.init({
        duration: 800,
        once: false,
        offset: 100,
        easing: 'ease-out',
        delay: 0,
        disable: false,
      });

      // Force refresh AOS after initialization
      setTimeout(() => {
        AOS.refresh();
      }, 100);
    };

    // If window already loaded, initialize immediately
    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
      return () => window.removeEventListener('load', handleLoad);
    }
  }, []);

  return (
    <>
      <Header />
      <HomeToFlashcardButton />
      <div className='h-screen overscroll-none'>
        <img
          src={landingImage}
          alt='Landing Image'
          className='object-cover h-screen w-full'
        />
      </div>
      <div>
        <section className='min-h-screen bg-sand flex flex-col items-center pb-20'>
          <div className='mt-20 text-3xl font-bold tracking-tight' data-aos='fade-down'>
            <span className='text-dark'>Giới thiệu về </span>
            <span className='text-sage uppercase tracking-[0.2em]'>ENGBOOST</span>
          </div>
          <div className='mt-10 px-60 text-center leading-relaxed text-dark/80' data-aos='fade-up'>
            <p className='text-lg font-medium'>
              ENGBOOST cho phép bạn tải lên ảnh, nhận diện vật thể và hiển thị
              từ vựng liên quan kèm nghĩa. Dễ dàng lưu lại, ôn tập và theo dõi
              tiến trình học tập mọi lúc, mọi nơi!
            </p>
          </div>

          <div
            data-aos='fade-right'
            data-aos-duration='800'
            className='mt-40 mx-36 flex items-center gap-20'
          >
            <div className='w-3/5 space-y-4'>
              <h3 className='text-3xl font-bold tracking-tight text-dark'>
                Học Từ Vựng Qua Hình Ảnh – <br />
                <span className='text-rose'>
                  Ghi Nhớ Dễ Dàng, Nhớ Lâu Hơn!
                </span>
              </h3>
              <p className='text-dark/70 text-lg leading-relaxed'>
                Bạn đã bao giờ quên ngay từ vựng sau khi học chưa? Với phương
                pháp học qua hình ảnh thực tế, website giúp bạn kết nối từ vựng
                với thế giới xung quanh một cách trực quan, dễ hiểu và ghi nhớ
                lâu hơn.
              </p>
            </div>

            <div className='relative' data-aos='zoom-in' data-aos-delay='200'>
              <img
                src={homeImage1Sub2}
                alt=''
                className='absolute -top-10 -left-10 z-0 opacity-40'
              />

              <img src={homeImage1} alt='Image 1' className='relative z-10 rounded-3xl shadow-2xl' />

              <img
                src={homeImage1Sub1}
                alt=''
                className='absolute -bottom-10 -right-10 z-5'
              />
            </div>
          </div>

          <div
            data-aos='fade-left'
            data-aos-duration='800'
            className='mt-40 mx-36 flex items-center gap-20'
          >
            <div className='relative' data-aos='zoom-in' data-aos-delay='200'>
              <img
                src={homeImage2Sub1}
                alt='Image 2'
                className='absolute -top-22 -right-2'
              />
              <img src={homeImage2} alt='Image 2' className='rounded-3xl shadow-2xl' />
              <img
                src={homeImage2Sub2}
                alt='Image 2'
                className='absolute -top-6 -right-12'
              />
            </div>

            <div className='w-3/5 space-y-4'>
              <h3 className='text-3xl font-bold tracking-tight text-dark'>
                Biến Mọi Khoảnh Khắc Thành Cơ Hội – <br />
                <span className='text-sage'>Học Tiếng Anh</span>
              </h3>
              <p className='text-dark/70 text-lg leading-relaxed'>
                Tải lên ảnh, quét vật thể và khám phá ngay từ vựng tiếng Anh
                liên quan! Website giúp bạn học mọi lúc, mọi nơi mà không cần
                cài đặt ứng dụng. Học tiếng Anh chưa bao giờ tiện lợi và thú vị
                đến thế!
              </p>
            </div>
          </div>

          <div
            data-aos='fade-right'
            data-aos-duration='800'
            className='mt-40 mx-36 flex items-center gap-20'
          >
            <div className='w-3/5 space-y-4'>
              <h3 className='text-3xl font-bold tracking-tight text-dark'>
                Học Như Trẻ Em – <br />
                <span className='text-blue'>Ghi Nhớ Như Người Bản Xứ</span>
              </h3>
              <p className='text-dark/70 text-lg leading-relaxed'>
                Trẻ em học ngôn ngữ bằng cách liên kết từ với hình ảnh thực tế
                xung quanh. Website của chúng tôi mang đến trải nghiệm tương tự,
                giúp bạn học từ vựng tự nhiên, dễ nhớ và áp dụng ngay vào cuộc
                sống hàng ngày.
              </p>
            </div>
            <div data-aos='zoom-in' data-aos-delay='200'>
              <img src={homeImage3} alt='Image 1' className='rounded-3xl shadow-2xl' />
            </div>
          </div>
        </section>
      </div>

      <div>
        <section className='py-24 bg-sand-dark grid grid-cols-1 md:grid-cols-3 gap-10 px-16'>
          {/* Feature 1 */}
          <div
            className='group bg-white/60 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] rounded-[2.5rem] p-10 text-left border border-white/60 hover:translate-y-[-8px] transition-all duration-500 relative overflow-hidden'
            data-aos='fade-up'
            data-aos-duration='1000'
          >
            <div className='absolute top-0 right-0 p-8'>
              <span className='text-7xl font-bold text-sage/10 select-none group-hover:text-sage/20 transition-colors duration-500'>01</span>
            </div>
            <div className='w-14 h-1.5 bg-sage rounded-full mb-8'></div>
            <h3 className='text-2xl font-bold mb-5 text-dark tracking-tight leading-tight'>
              Chụp ảnh, nhận diện từ vựng
            </h3>
            <p className='text-dark/70 text-base leading-relaxed font-medium'>
              Chụp ảnh và nhận diện từ vựng ngay lập tức, giúp bạn kết nối ngôn ngữ với môi trường thực tế một cách tự nhiên.
            </p>
          </div>

          {/* Feature 2 */}
          <div
            className='group bg-white/60 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] rounded-[2.5rem] p-10 text-left border border-white/60 hover:translate-y-[-8px] transition-all duration-500 relative overflow-hidden'
            data-aos='fade-up'
            data-aos-delay='200'
            data-aos-duration='1000'
          >
            <div className='absolute top-0 right-0 p-8'>
              <span className='text-7xl font-bold text-rose/10 select-none group-hover:text-rose/20 transition-colors duration-500'>02</span>
            </div>
            <div className='w-14 h-1.5 bg-rose rounded-full mb-8'></div>
            <h3 className='text-2xl font-bold mb-5 text-dark tracking-tight leading-tight'>
              Ôn tập từ vựng đã học
            </h3>
            <p className='text-dark/70 text-base leading-relaxed font-medium'>
              Hệ thống ôn tập thông minh với kỹ thuật lặp lại ngắt quãng giúp bạn ghi nhớ từ vựng sâu hơn và lâu dài hơn.
            </p>
          </div>

          {/* Feature 3 */}
          <div
            className='group bg-white/60 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] rounded-[2.5rem] p-10 text-left border border-white/60 hover:translate-y-[-8px] transition-all duration-500 relative overflow-hidden'
            data-aos='fade-up'
            data-aos-delay='400'
            data-aos-duration='1000'
          >
            <div className='absolute top-0 right-0 p-8'>
              <span className='text-7xl font-bold text-blue/10 select-none group-hover:text-blue/20 transition-colors duration-500'>03</span>
            </div>
            <div className='w-14 h-1.5 bg-blue rounded-full mb-8'></div>
            <h3 className='text-2xl font-bold mb-5 text-dark tracking-tight leading-tight'>
              Cá nhân hoá lộ trình học
            </h3>
            <p className='text-dark/70 text-base leading-relaxed font-medium'>
              Lộ trình học tập được thiết kế riêng biệt dựa trên sở thích và tiến độ của bạn, tối ưu hóa quá trình tiếp thu kiến thức.
            </p>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}


export default Home;
