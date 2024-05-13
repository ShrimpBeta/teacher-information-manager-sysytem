package excel

import (
	"bytes"
	"fmt"

	"github.com/xuri/excelize/v2"
)

func ReadFile(file []byte) ([][]string, error) {

	// 将文件内容转换为bytes.Reader对象
	reader := bytes.NewReader(file)

	// 使用excelize.OpenReader从内存中打开Excel文件
	f, err := excelize.OpenReader(reader)
	if err != nil {
		fmt.Println(err)
		return nil, err
	}
	defer f.Close()

	// 默认读取Sheet1中的数据
	SheetName := f.GetSheetName(0)
	rows, err := f.GetRows(SheetName)
	if err != nil {
		fmt.Println(err)
		return nil, err
	}

	return rows, nil
}
