import React, { useState, useEffect } from "react";
import { Table, Button, Image, message, Modal, Input, Carousel } from "antd";
import AddProductModal from "../../Modal/ModalAddProduct";
import {
  addProduct,
  getProduct,
  deleteProductById,
  updateProductById,
} from "../../Server/ProductsApi";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { confirm } = Modal;

  // Fetch sản phẩm khi component mount
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const response = await getProduct();
        if (response.status === 200) {
          const data = response.data.data.map((product) => ({
            ...product,
            key: product._id,
            HinhAnh: Array.isArray(product.HinhAnh)
              ? product.HinhAnh
              : [product.HinhAnh],
            soLuongTon: product.KichThuoc.reduce(
              (total, size) => total + size.soLuongTon,
              0
            ),
          }));
          setProducts(data);
        } else {
          message.error("Lấy danh sách sản phẩm không thành công!");
        }
      } catch (error) {
        message.error(error.response?.data?.message || "Đã xảy ra lỗi!");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Hàm thêm hoặc sửa sản phẩm
  const handleAddOrEditProduct = async (product) => {
    if (product.GiaBan < 1000) {
      message.error("Giá bán phải lớn hơn hoặc bằng 1,000 VND!");
      return;
    }
    setIsAddModalVisible(false);

    if (editingProduct) {
      // Cập nhật sản phẩm
      try {
        const response = await updateProductById(editingProduct._id, product);
        if (response.status === 200) {
          const updatedProduct = response.data;
          setProducts((prevProducts) =>
            prevProducts.map((p) =>
              p._id === updatedProduct._id
                ? { ...p, ...updatedProduct, key: updatedProduct._id }
                : p
            )
          );
          message.success("Sản phẩm đã được cập nhật!");
        }
      } catch (error) {
        message.error(error.response?.data?.message || "Cập nhật thất bại!");
      }
    } else {
      // Thêm mới sản phẩm
      try {
        const response = await addProduct(product);
        if (response.status === 201) {
          const newProduct = response.data;
          setProducts((prevProducts) => [
            ...prevProducts,
            { ...newProduct, key: newProduct._id },
          ]);
          message.success("Sản phẩm đã được thêm mới!");
        }
      } catch (error) {
        message.error(error.response?.data?.message || "Thêm mới thất bại!");
      }
    }

    setEditingProduct(null);
  };

  // Hàm xóa sản phẩm
  const handleDelete = (key) => {
    const productToDelete = products.find((item) => item.key === key);
    confirm({
      title: "Bạn có chắc chắn muốn xóa sản phẩm này không?",
      content: `Tên sản phẩm: ${productToDelete.TenSP}`,
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          await deleteProductById(productToDelete._id);
          setProducts((prevProducts) =>
            prevProducts.filter((item) => item.key !== key)
          );
          message.success("Sản phẩm đã được xóa thành công!");
        } catch (error) {
          message.error("Đã xảy ra lỗi khi xóa sản phẩm!");
        }
      },
    });
  };

  // Hiển thị modal thêm sản phẩm
  const showAddProductModal = () => {
    setIsAddModalVisible(true);
    setEditingProduct(null);
  };

  // Hiển thị modal chỉnh sửa sản phẩm
  const showEditProductModal = (product) => {
    setEditingProduct(product);
    setIsAddModalVisible(true);
  };

  const handleCancel = () => {
    setIsAddModalVisible(false);
    setEditingProduct(null);
  };

  // Tìm kiếm sản phẩm
  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const filteredProducts = products.filter((product) =>
    product.TenSP.toLowerCase().includes(searchTerm)
  );

  const columns = [
    { title: "Tên Sản Phẩm", dataIndex: "TenSP", key: "name" },
    {
      title: "Hình Ảnh",
      dataIndex: "HinhAnh",
      key: "HinhAnh",
      render: (HinhAnh) =>
        Array.isArray(HinhAnh) && HinhAnh.length > 0 ? (
          <Image.PreviewGroup>
            <Image
              width={50}
              src={HinhAnh[0]} // Display only the first image as a thumbnail
              preview={{
                src: HinhAnh[0], // The main preview will start with the first image
              }}
            />
            {HinhAnh.slice(1).map((url, index) => (
              <Image key={index} src={url} style={{ display: "none" }} />
            ))}
          </Image.PreviewGroup>
        ) : (
          "Không có hình ảnh"
        ),
    },

    { title: "Thương Hiệu", dataIndex: "ThuongHieu", key: "ThuongHieu" },
    {
      title: "Giá Bán",
      dataIndex: "GiaBan",
      key: "GiaBan",
      sorter: (a, b) => a.GiaBan - b.GiaBan,
      render: (GiaBan) => (GiaBan ? `${GiaBan.toLocaleString()} VND` : "N/A"),
    },
    { title: "Số lượng tổng", dataIndex: "soLuongTon", key: "soLuongTon" },
    {
      title: "Hành Động",
      key: "action",
      render: (text, record) => (
        <>
          <Button type="link" onClick={() => showEditProductModal(record)}>
            Sửa
          </Button>
          <Button type="link" onClick={() => handleDelete(record.key)} danger>
            Xóa
          </Button>
        </>
      ),
    },
  ];

  return (
    <div>
      <Input.Search
        placeholder="Tìm kiếm sản phẩm..."
        onChange={handleSearch}
        style={{ marginBottom: "16px" }}
      />
      <Button
        type="primary"
        style={{ marginBottom: "16px" }}
        onClick={showAddProductModal}
      >
        Thêm Sản Phẩm
      </Button>
      <Table
        columns={columns}
        dataSource={filteredProducts}
        loading={isLoading}
        rowKey="key"
        expandable={{
          expandedRowRender: (record) => (
            <div>
              <h4>Kích thước & Số lượng:</h4>
              <ul>
                {record.KichThuoc.map((size, index) => (
                  <li key={index}>
                    <strong>Size {size.size}:</strong> {size.soLuongTon} còn
                  </li>
                ))}
              </ul>
              <h4>Mô tả sản phẩm:</h4>
              <p>{record.MoTa}</p>
            </div>
          ),
        }}
      />
      <AddProductModal
        visible={isAddModalVisible}
        onAdd={handleAddOrEditProduct}
        onCancel={handleCancel}
        initialValues={editingProduct}
      />
    </div>
  );
};

export default Products;
