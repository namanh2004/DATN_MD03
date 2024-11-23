package com.example.datn_md03_ungdungmuabangiaysneakzone.Activity;

import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.text.TextUtils;
import android.util.Patterns;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import com.example.datn_md03_ungdungmuabangiaysneakzone.R;
import com.example.datn_md03_ungdungmuabangiaysneakzone.api.ApiResponse;
import com.example.datn_md03_ungdungmuabangiaysneakzone.api.ApiService;
import com.example.datn_md03_ungdungmuabangiaysneakzone.api.RetrofitClient;
import com.example.datn_md03_ungdungmuabangiaysneakzone.model.TemporaryVerificationCode;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class DangKy extends AppCompatActivity {
    private EditText editTextTen, editTextEmail, editTextPassword, editTextRePassword;
    private Button btnDangKy;
    private ApiService apiService;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_dang_ky);

        // Ánh xạ các view
        editTextTen = findViewById(R.id.editTextTen);
        editTextEmail = findViewById(R.id.editTextEmail2);
        editTextPassword = findViewById(R.id.editTextPassword2);
        editTextRePassword = findViewById(R.id.editTextRePassword);
        btnDangKy = findViewById(R.id.btnDangKy);

        // Khởi tạo ApiService
        apiService = RetrofitClient.getClient().create(ApiService.class);

        // Xử lý khi bấm nút Đăng Ký
        btnDangKy.setOnClickListener(v -> {
            String ten = editTextTen.getText().toString().trim();
            String email = editTextEmail.getText().toString().trim();
            String password = editTextPassword.getText().toString().trim();
            String rePassword = editTextRePassword.getText().toString().trim();

            // Kiểm tra dữ liệu nhập vào
            if (TextUtils.isEmpty(ten)) {
                Toast.makeText(DangKy.this, "Vui lòng nhập tên!", Toast.LENGTH_SHORT).show();
                return;
            }

            if (TextUtils.isEmpty(email) || !Patterns.EMAIL_ADDRESS.matcher(email).matches()) {
                Toast.makeText(DangKy.this, "Vui lòng nhập email hợp lệ!", Toast.LENGTH_SHORT).show();
                return;
            }

            if (TextUtils.isEmpty(password) || password.length() < 6) {
                Toast.makeText(DangKy.this, "Mật khẩu phải có ít nhất 6 ký tự!", Toast.LENGTH_SHORT).show();
                return;
            }

            if (!password.equals(rePassword)) {
                Toast.makeText(DangKy.this, "Mật khẩu không khớp!", Toast.LENGTH_SHORT).show();
                return;
            }

            // Tạo đối tượng TemporaryVerificationCode rỗng
            TemporaryVerificationCode tempCode = new TemporaryVerificationCode();

// Thiết lập các thuộc tính cần thiết
            tempCode.setTentaikhoan(email); // Thiết lập email
            tempCode.setHoten(ten); // Thiết lập tên
            tempCode.setMatkhau(password); // Thiết lập mật khẩu
// Các trường khác như verificationCode hoặc createdAt không cần thiết lập vì server xử lý


            Call<ApiResponse> call = apiService.register(tempCode);
            call.enqueue(new Callback<ApiResponse>() {
                @Override
                public void onResponse(Call<ApiResponse> call, Response<ApiResponse> response) {
                    if (response.isSuccessful() && response.body() != null) {
                        Toast.makeText(DangKy.this, "Đăng ký tạm thời thành công!", Toast.LENGTH_SHORT).show();

                        // Chuyển sang màn hình gửi mã xác thực
                        Intent intent = new Intent(DangKy.this,Activity_manhinhguimadangky.class);
                        intent.putExtra("email", email); // Gửi email để xác thực
                        startActivity(intent);
                        finish(); // Đóng màn hình đăng ký
                    } else {
                        Toast.makeText(DangKy.this, "Đăng ký thất bại!", Toast.LENGTH_SHORT).show();
                    }
                }

                @Override
                public void onFailure(Call<ApiResponse> call, Throwable t) {
                    Toast.makeText(DangKy.this, "Lỗi kết nối: " + t.getMessage(), Toast.LENGTH_SHORT).show();
                }
            });
        });
    }
}