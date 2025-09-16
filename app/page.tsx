import Link from "next/link";
import { Button } from "@/shared/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            해외선물 서비스
          </h1>
          <p className="text-lg text-gray-600">
            안전하고 편리한 해외선물 서비스를 경험해보세요
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* 신청자용 카드 */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-xl">서비스 신청</CardTitle>
              <CardDescription>
                해외선물 서비스를 신청하고 정보를 등록하세요
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/apply">
                <Button className="w-full">신청하기</Button>
              </Link>
            </CardContent>
          </Card>

          {/* 관리자용 카드 */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-xl">관리자 로그인</CardTitle>
              <CardDescription>
                관리자 계정으로 로그인하여 서비스를 관리하세요
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/auth/login">
                <Button variant="outline" className="w-full">
                  로그인
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="text-center text-sm text-gray-500">
          <p>
            관리자 계정이 없으신가요?{" "}
            <Link
              href="/auth/register"
              className="text-blue-600 hover:underline"
            >
              회원가입하기
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
