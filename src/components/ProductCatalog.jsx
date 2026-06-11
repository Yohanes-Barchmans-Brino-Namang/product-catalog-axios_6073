import { useEffect, useState } from "react";
import axios from "axios";

function ProductCatalog() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [ratingFilter, setRatingFilter] = useState(0);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cart, setCart] = useState([]);
  const [toast, setToast] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const productsPerPage = 8;

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get("https://fakestoreapi.com/products");
      setProducts(response.data);
      setError("");
    } catch (err) {
      setError("Gagal mengambil data produk");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        "https://fakestoreapi.com/products/categories"
      );
      setCategories(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleCategory = async (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
    setLoading(true);

    try {
      let url = "https://fakestoreapi.com/products";

      if (category !== "all") {
        url = `https://fakestoreapi.com/products/category/${category}`;
      }

      const response = await axios.get(url);
      setProducts(response.data);
      setError("");
    } catch (err) {
      setError("Gagal mengambil produk berdasarkan kategori");
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (product) => {
    setCart([...cart, product]);
    setToast(`${product.title} berhasil ditambahkan ke cart`);

    setTimeout(() => {
      setToast("");
    }, 2000);
  };

  let filteredProducts = products.filter((product) => {
    const matchSearch = product.title
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchRating = product.rating.rate >= ratingFilter;

    const matchMinPrice =
      minPrice === "" || product.price >= Number(minPrice);

    const matchMaxPrice =
      maxPrice === "" || product.price <= Number(maxPrice);

    return matchSearch && matchRating && matchMinPrice && matchMaxPrice;
  });

  if (sort === "low-high") {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sort === "high-low") {
    filteredProducts.sort((a, b) => b.price - a.price);
  }

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const lastIndex = currentPage * productsPerPage;
  const firstIndex = lastIndex - productsPerPage;
  const currentProducts = filteredProducts.slice(firstIndex, lastIndex);

  if (loading) {
    return <h2 style={styles.loading}>Loading produk...</h2>;
  }

  if (error) {
    return (
      <div style={styles.error}>
        <h2>{error}</h2>
        <button onClick={fetchProducts}>Coba Lagi</button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {toast && <div style={styles.toast}>{toast}</div>}

      <h1>Product Catalog</h1>
      <p>Total Cart: {cart.length}</p>

      <input
        type="text"
        placeholder="Cari produk berdasarkan judul..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setCurrentPage(1);
        }}
        style={styles.searchInput}
      />

      <div style={styles.filterBox}>
        <select
          value={selectedCategory}
          onChange={(e) => handleCategory(e.target.value)}
          style={styles.input}
        >
          <option value="all">Semua Kategori</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          style={styles.input}
        >
          <option value="">Urutkan Harga</option>
          <option value="low-high">Termurah ke Termahal</option>
          <option value="high-low">Termahal ke Termurah</option>
        </select>

        <select
          value={ratingFilter}
          onChange={(e) => {
            setRatingFilter(Number(e.target.value));
            setCurrentPage(1);
          }}
          style={styles.input}
        >
          <option value="0">Semua Rating</option>
          <option value="1">⭐ 1+</option>
          <option value="2">⭐ 2+</option>
          <option value="3">⭐ 3+</option>
          <option value="4">⭐ 4+</option>
        </select>

        <input
          type="number"
          placeholder="Harga Min"
          value={minPrice}
          onChange={(e) => {
            setMinPrice(e.target.value);
            setCurrentPage(1);
          }}
          style={styles.input}
        />

        <input
          type="number"
          placeholder="Harga Max"
          value={maxPrice}
          onChange={(e) => {
            setMaxPrice(e.target.value);
            setCurrentPage(1);
          }}
          style={styles.input}
        />
      </div>

      <p>Jumlah produk tampil: {filteredProducts.length}</p>

      <div style={styles.grid}>
        {currentProducts.map((product) => (
          <div key={product.id} style={styles.card}>
            <img src={product.image} alt={product.title} style={styles.image} />

            <h3>{product.title}</h3>
            <p>Harga: ${product.price}</p>
            <p>Rating: ⭐ {product.rating.rate}</p>

            <button
              onClick={() => setSelectedProduct(product)}
              style={styles.detailButton}
            >
              Detail
            </button>

            <button
              onClick={() => addToCart(product)}
              style={styles.cartButton}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <p style={styles.noData}>Produk tidak ditemukan.</p>
      )}

      <div style={styles.pagination}>
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          Previous
        </button>

        <span style={styles.pageText}>
          {totalPages === 0 ? 0 : currentPage} / {totalPages}
        </span>

        <button
          disabled={currentPage === totalPages || totalPages === 0}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Next
        </button>
      </div>

      {selectedProduct && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <button
              onClick={() => setSelectedProduct(null)}
              style={styles.closeButton}
            >
              X
            </button>

            <img
              src={selectedProduct.image}
              alt={selectedProduct.title}
              style={styles.modalImage}
            />

            <h2>{selectedProduct.title}</h2>
            <p>{selectedProduct.description}</p>
            <p>Kategori: {selectedProduct.category}</p>
            <p>Harga: ${selectedProduct.price}</p>
            <p>Rating: ⭐ {selectedProduct.rating.rate}</p>
            <p>Jumlah Review: {selectedProduct.rating.count}</p>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: "20px",
    fontFamily: "Arial, sans-serif",
  },
  loading: {
    textAlign: "center",
    marginTop: "50px",
  },
  error: {
    textAlign: "center",
    marginTop: "50px",
  },
  searchInput: {
    padding: "10px",
    width: "100%",
    marginBottom: "15px",
    boxSizing: "border-box",
  },
  filterBox: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
    flexWrap: "wrap",
  },
  input: {
    padding: "10px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "20px",
  },
  card: {
    border: "1px solid #ddd",
    padding: "15px",
    borderRadius: "10px",
    textAlign: "center",
    backgroundColor: "#fff",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
  },
  image: {
    width: "100%",
    height: "180px",
    objectFit: "contain",
  },
  detailButton: {
    padding: "8px 12px",
    marginRight: "8px",
    cursor: "pointer",
  },
  cartButton: {
    padding: "8px 12px",
    cursor: "pointer",
  },
  pagination: {
    marginTop: "20px",
    textAlign: "center",
  },
  pageText: {
    margin: "0 15px",
    fontWeight: "bold",
  },
  noData: {
    textAlign: "center",
    marginTop: "20px",
  },
  toast: {
    position: "fixed",
    top: "20px",
    right: "20px",
    backgroundColor: "#222",
    color: "white",
    padding: "12px 18px",
    borderRadius: "8px",
    zIndex: 2000,
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modal: {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "10px",
    maxWidth: "500px",
    maxHeight: "80vh",
    overflowY: "auto",
    textAlign: "center",
  },
  modalImage: {
    width: "150px",
    height: "150px",
    objectFit: "contain",
  },
  closeButton: {
    float: "right",
    cursor: "pointer",
  },
};

export default ProductCatalog;