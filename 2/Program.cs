using System;

namespace SimpleProgram
{
    class Program
    {
        static void Main(string[] args)
        {
            // In ra màn hình lời chào
            Console.WriteLine("Chao mung ban den voi C#!");

            // Nhập tên người dùng
            Console.Write("Mời bạn nhập tên của mình: ");
            string name = Console.ReadLine();
            Console.WriteLine("Xin chao, " + name + "!");

            // Ví dụ tính toán đơn giản (Tính tổng 2 số)
            int a = 10;
            int b = 20;
            int tong = a + b;

            Console.WriteLine("Tong cua " + a + " + " + b + " = " + tong);

            // Dừng màn hình để đọc kết quả
            Console.WriteLine("\nAn phim bat ky de thoat...");
            Console.ReadKey();
        }
    }
}