package com.example.datn_md03_ungdungmuabangiaysneakzone.api;

import com.example.datn_md03_ungdungmuabangiaysneakzone.model.CustomerAccount;
import com.example.datn_md03_ungdungmuabangiaysneakzone.model.KichThuoc;
import com.example.datn_md03_ungdungmuabangiaysneakzone.model.Product;
import com.example.datn_md03_ungdungmuabangiaysneakzone.model.ResetPasswordRequest;
import com.example.datn_md03_ungdungmuabangiaysneakzone.model.Response;

import java.util.ArrayList;

import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.GET;
import retrofit2.http.POST;
import retrofit2.http.PUT;
import retrofit2.http.Path;

public interface ApiService {
    @POST("/auth/register")
    Call<ApiResponse> register(@Body CustomerAccount customerAccount);

    @POST("/auth/login")
    Call<ApiResponse> login(@Body CustomerAccount customerAccount);

    @PUT("/update-account/{id}")
    Call<ApiResponse> updateAccount(@Path("id") String id, @Body CustomerAccount customerAccount);
    @POST("/auth/send-reset-password-email")
    Call<ApiResponse> forgotPassword(@Body CustomerAccount customerAccount);
    @POST("/auth/reset-password")
    Call<ApiResponse> resetPassword(@Body ResetPasswordRequest request);

    @GET("/api/get-list-product")
    Call<Response<ArrayList<Product>>> getListProducts();

    @GET("/api/get-product-by-id/{id}")
    Call<Response<Product>> getProductById(@Path("id") String id);

}
