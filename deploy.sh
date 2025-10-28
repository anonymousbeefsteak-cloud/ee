#!/bin/bash
set -e

# 台灣小吃店 LINE 訂餐系統 - 部署腳本
# 包含安全檢查、代碼混淆和自動部署功能

# 顏色定義
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # 無顏色

# 檢查 Node.js 是否安裝
if ! command -v node &> /dev/null
then
    echo -e "${RED}錯誤: Node.js 未安裝，請先安裝 Node.js${NC}"
    exit 1
fi

# 檢查 npm 是否安裝
if ! command -v npm &> /dev/null
then
    echo -e "${RED}錯誤: npm 未安裝，請先安裝 npm${NC}"
    exit 1
fi

# 檢查是否安裝必要的依賴
check_dependencies() {
    echo -e "${YELLOW}檢查必要的依賴...${NC}"
    
    # 檢查 terser (用於代碼混淆)
    if ! npm list terser -g &> /dev/null
    then
        echo -e "${YELLOW}安裝 terser 用於代碼混淆...${NC}"
        npm install -g terser
    fi
    
    # 檢查 vercel CLI (用於部署)
    if ! npm list vercel -g &> /dev/null
    then
        echo -e "${YELLOW}安裝 Vercel CLI 用於部署...${NC}"
        npm install -g vercel
    fi
    
    echo -e "${GREEN}必要的依賴檢查完成${NC}"
}

# 環境變數檢查
check_environment() {
    echo -e "${YELLOW}檢查環境變數配置...${NC}"
    
    # 檢查是否存在 .env 文件
    if [ ! -f ".env" ]; then
        echo -e "${YELLOW}.env 文件不存在，使用 .env.example 作為模板${NC}"
        cp .env.example .env
    fi
    
    # 檢查必要的環境變數
    local required_vars=("NEXT_PUBLIC_LIFF_ID" "NEXT_PUBLIC_API_ENDPOINT")
    local missing_vars=()
    
    for var in "${required_vars[@]}"; do
        if [ -z "$(grep -E "^${var}=" .env | cut -d '=' -f2-)" ]; then
            missing_vars+=("$var")
        fi
    done
    
    if [ ${#missing_vars[@]} -ne 0 ]; then
        echo -e "${RED}錯誤: 缺少以下必要的環境變數: ${missing_vars[*]}${NC}"
        echo -e "${YELLOW}請在 .env 文件中配置這些變數${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}環境變數檢查完成${NC}"
}

# 代碼混淆
obfuscate_code() {
    echo -e "${YELLOW}正在代碼混淆...${NC}"
    
    # 檢查是否原始文件是否存在
    if [ ! -f "index.html" ]; then
        echo -e "${RED}錯誤: index.html 文件不存在${NC}"
        exit 1
    fi
    
    # 備份原始文件
    cp index.html index.original.html
    
    # 提取並混淆 JavaScript 代碼
    # 這裡使用簡單的方法，實際項目中可能需要更複雜的處理
    echo -e "${YELLOW}正在處理 JavaScript 代碼...${NC}"
    
    # 使用 terser 混淆代碼 (創建臨時文件)
    # 注意：這只是示例，實際中可能需要更複雜的處理
    local temp_js=$(mktemp)
    
    # 提取 script 標籤內容
    awk '/<script type="text\/babel">/,/<\/script>/' index.html > "$temp_js"
    
    # 移除 script 標籤
    sed -i '/<script type="text\/babel">/,/<\/script>/d' index.html
    
    # 混淆 JavaScript 代碼
    terser "$temp_js" -o "$temp_js.obfuscated" --compress --mangle --toplevel
    
    # 將混淆後的代碼碼放回 HTML
    echo '<script type="text/babel">' >> index.html
    cat "$temp_js.obfuscated >> index.html
    echo '</script>' >> index.html
    
    # 清理臨時文件
    rm -f "$temp_js" "$temp_js.obfuscated"
    
    echo -e "${GREEN}代碼混淆混淆完成${NC}"
}

# 部署到 Vercel
deploy_to_vercel() {
    echo -e "${YELLOW}部署到 Vercel...${NC}"
    
    # 檢查是否已登錄 Vercel
    if ! vercel whoami &> /dev/null; then
        echo -e "${YELLOW}請登錄 Vercel 帳號...${NC}"
        vercel login
    fi
    
    # 部署
    if [ "$1" = "production" ]; then
        echo -e "${YELLOW}部署到生產環境...${NC}"
        vercel --prod
    else
        echo -e "${YELLOW}部署到預覽環境...${NC}"
        vercel
    fi
    
    echo -e "${GREEN}部署完成${NC}"
}

# 恢復原始文件
restore_original() {
    if [ -f "index.original.html" ]; then
        echo -e "${YELLOW}恢復原始文件...${NC}"
        mv index.original.html index.html
    fi
}

# 顯示幫助信息
show_help() {
    echo -e "${GREEN}台灣小吃店 LINE 訂餐系統 - 部署腳本${NC}"
    echo -e "${YELLOW}用法: $0 [選項]${NC}"
    echo "選項:"
    echo "  --deploy-dev      部署到開發環境"
    echo "  --deploy-prod     部署到生產環境 (包含代碼混淆)"
    echo "  --check           僅檢查環境配置"
    echo "  --help            顯示幫助信息"
    echo ""
    echo "示例:"
    echo "  $0 --check                檢查環境配置"
    echo "  $0 --deploy-dev           部署到開發環境"
    echo "  $0 --deploy-prod          部署到生產環境"
}

# 主函數
main() {
    if [ $# -eq 0 ]; then
        show_help
        exit 1
    fi
    
    # 檢查依賴
    check_dependencies
    
    case "$1" in
        --check)
            check_environment
            echo -e "${GREEN}所有檢查通過！${NC}"
            ;;
        --deploy-dev)
            check_environment
            deploy_to_vercel
            ;;
        --deploy-prod)
            check_environment
            obfuscate_code
            trap restore_original EXIT  # 確保在腳本結束時恢復原始文件
            deploy_to_vercel production
            ;;
        --help)
            show_help
            ;;
        *)
            echo -e "${RED}無效的選項: $1${NC}"
            show_help
            exit 1
            ;;
    esac
    
    echo -e "${GREEN}操作完成！${NC}"
}

# 執行主函數
main "$@"
