import Hero from "@/widgets/Hero";
import Image from "next/image";
import ApplicantForm from "@/features/applicant/ui/ApplicantForm";
import BannerApplicantForm from "@/features/applicant/ui/BannerApplicantForm";
import StickySideLinks from "@/widgets/StickySideLinks";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center pb-0 md:pb-48">
      <Hero
        src="https://gjgciairviherlylizsx.supabase.co/storage/v1/object/public/images/1.webp"
        alt="메인 히어로"
        width={1000}
        height={600}
      />
      <Hero
        src="https://gjgciairviherlylizsx.supabase.co/storage/v1/object/public/images/lee%20(1).webp"
        alt="파트너쉽"
        width={1000}
        height={600}
      />
      <Hero
        src="https://gjgciairviherlylizsx.supabase.co/storage/v1/object/public/images/paris.webp"
        alt="신규 이벤트 지원"
        width={1000}
        height={600}
      />
      <Hero
        src="https://gjgciairviherlylizsx.supabase.co/storage/v1/object/public/images/5.webp"
        alt="KBS N"
        width={1000}
        height={600}
      />
      <Hero
        src="https://gjgciairviherlylizsx.supabase.co/storage/v1/object/public/images/dubai.webp"
        alt="두바이 엑스포"
        width={1000}
        height={600}
      />

      <div className="w-full max-w-6xl mx-auto py-12">
        <div className="flex flex-col md:flex-row gap-6 items-center mt-5">
          <div className="flex">
            <Image
              src="https://gjgciairviherlylizsx.supabase.co/storage/v1/object/public/images/video.webp"
              alt="영상 소개"
              width={400}
              height={200}
              className="h-auto"
            />
          </div>
          <div className="flex-1 w-full">
            <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
              <iframe
                className="absolute inset-0 w-full h-full shadow-lg"
                src="https://www.youtube.com/embed/8aOkcyVhqbA?rel=0&modestbranding=1"
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      </div>

      <Hero
        src="https://gjgciairviherlylizsx.supabase.co/storage/v1/object/public/images/service.webp"
        alt="거래소 소개"
        width={600}
        height={288}
        className="w-full max-w-[600px] h-auto"
      />

      <div className="w-full">
        <div className="max-w-6xl mx-auto px-6 bg-white  py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              계좌개설 이벤트
            </h2>
            <p className="text-lg md:text-xl text-gray-700">
              신청 및 가입상담문의
            </p>
          </div>

          <div className="bg-gray-800 rounded-lg p-8 shadow-2xl">
            <ApplicantForm />
          </div>
        </div>
      </div>

      <div
        className="shadow-2xl z-50 relative w-screen py-3 hidden md:block"
        style={{
          position: "fixed",
          bottom: "0",
          left: "0",
          right: "0",
          height: "180px",
          backgroundColor: "#263948",
        }}
      >
        <div className="max-w-6xl mx-auto flex items-center gap-3 md:gap-6 px-3 md:px-6 h-full">
          <div className="flex-shrink-0 h-full hidden md:block">
            <Image
              src="https://gjgciairviherlylizsx.supabase.co/storage/v1/object/public/images/support.webp"
              alt="이벤트 배너"
              width={150}
              height={120}
              className="w-full h-full object-cover rounded-lg"
            />
          </div>

          <div className="w-full md:w-3/5 flex-1">
            <BannerApplicantForm />
          </div>
        </div>
      </div>

      <StickySideLinks
        items={[
          {
            href: "https://open.kakao.com/o/saNIhwSh",
            image: {
              src: "https://gjgciairviherlylizsx.supabase.co/storage/v1/object/public/images/metatrader.webp",
              alt: "메타트레이더",
            },
          },
          {
            href: "https://open.kakao.com/o/saNIhwSh",
            image: {
              src: "https://gjgciairviherlylizsx.supabase.co/storage/v1/object/public/images/kakao.webp",
              alt: "카카오톡",
            },
          },
          {
            href: "https://open.kakao.com/o/saNIhwSh",
            image: {
              src: "https://gjgciairviherlylizsx.supabase.co/storage/v1/object/public/images/question.webp",
              alt: "문의",
            },
          },
        ]}
        mobileItem={{
          href: "https://open.kakao.com/o/saNIhwSh",
          mobileHref: "tel:01012345678",
          image: {
            src: "https://gjgciairviherlylizsx.supabase.co/storage/v1/object/public/images/phone.webp",
            alt: "전화 상담",
          },
        }}
      />
    </main>
  );
}
