package main

import (
	"fmt"
	"os"
	"strings"

	"github.com/go-the-way/exl"
	"github.com/nfx/go-htmltable"
	"github.com/tealeg/xlsx/v3"
)

type TimetableHtml struct {
	// Course Code	Course Name	L	T	P	C	Name of the Instructors and Tutors	Lecture	Tutorial	Lab	Link to Course Plan	Preferred Knowledge Equivalent to	Remarks	Minor in	HSS/BS elective
	CourseCode  string `header:"A"`
	CourseName  string `header:"B"`
	L           string `header:"C"`
	T           string `header:"D"`
	P           string `header:"E"`
	C           string `header:"F"`
	Instructors string `header:"G"`
	Lecture     string `header:"K"`
	Tutorial    string `header:"L"`
	Lab         string `header:"M"`
	CoursePlan  string `header:"N"`
	Knowledge   string `header:"O"`
	Remarks     string `header:"P"`
	Minor       string `header:"Q"`
	Elective    string `header:"R"`
}

func ParseHtml() {
	fmt.Println("Parsing...")
	// read the html file from ""../data/Timetable 2024-25, Sem-II/Time table.html" to string
	htmlString, err := os.ReadFile("./data/Timetable 2024-25, Sem-II/Time table.html")
	if err != nil {
		fmt.Println(err)
		return
	}

	table, _ := htmltable.NewFromString(string(htmlString))
	fmt.Println(table.Tables[0].Rows[0])
	// fmt.Println(table)

	timetable, _ := htmltable.NewSliceFromPage[TimetableHtml](table)
	fmt.Println(timetable)
}

type TimetableXlsx struct {
	CourseCode  string
	CourseName  string
	L           string
	T           string
	P           string
	C           string
	Instructors string
	Lecture     string
	Tutorial    string
	Lab         string
	CoursePlan  Hyperlink
	Knowledge   string
	Remarks     string
	Minor       string
	Elective    string
}

func cellVisitor(c *xlsx.Cell) error {
	emptyHyperlink := xlsx.Hyperlink{}
	if c.Hyperlink != emptyHyperlink {
		fmt.Println(c.Hyperlink.Link)
	}
	// fmt.Println(c.Hyperlink.Link)
	return nil
}

func rowVisitor(r *xlsx.Row) error {
	fmt.Println(r)
	return r.ForEachCell(cellVisitor)
}

func cleanSheet(sheet *xlsx.Sheet) {
	sheet.MaxCol = 18
	sheet.MaxRow = 314
}

func ParseXlsxFail() {
	fmt.Println("Parsing...")
	// read the xlsx file from ""../data/Timetable 2024-25, Sem-II/Time table.xlsx"
	xlsxFile, err := xlsx.OpenFile("./data/Timetable 2024-25, Sem-II.xlsx")
	if err != nil {
		fmt.Println(err)
		return
	}

	sheet := xlsxFile.Sheets[0]
	// timetable := []TimetableXlsx{}
	cleanSheet(sheet)

	err = sheet.ForEachRow(rowVisitor)
	fmt.Println("Err=", err)
}

type Hyperlink struct {
	Display string `json:"display"`
	Link    string `json:"link"`
}

// Implement the ExcelUnmarshaler interface for Hyperlink
func (h *Hyperlink) UnmarshalExcel(cell *xlsx.Cell, _ *exl.ExcelUnmarshalParameters) error {
	emptyHyperlink := xlsx.Hyperlink{}
	if cell.Hyperlink != emptyHyperlink {
		h.Link = cell.Hyperlink.Link
	}
	h.Display = cell.String()
	return nil
}

type Slots []Slot

type Slot struct {
	Times    []string `json:"times"`
	Location string   `json:"location"`
}

// Implement the ExcelUnmarshaler interface for []Slot
func (s *Slots) UnmarshalExcel(cell *xlsx.Cell, _ *exl.ExcelUnmarshalParameters) error {
	cellValue := cell.String()
	if cellValue == "" {
		*s = []Slot{}
		return nil
	}

	lines := strings.Split(cellValue, "\n")
	var slots []Slot

	for i := 0; i < len(lines); i += 2 {
		if i+1 >= len(lines) {
			break
		}
		timeLine := lines[i]
		locationLine := lines[i+1]

		times := strings.Split(timeLine, ",")
		for j := range times {
			times[j] = strings.TrimSpace(times[j])
		}

		slot := Slot{
			Times:    times,
			Location: strings.TrimSpace(locationLine),
		}
		slots = append(slots, slot)
	}

	*s = slots
	return nil
}

type Timetable struct {
	CourseCode  string    `excel:"Course Code" json:"course_code"`
	CourseName  string    `excel:"Course Name" json:"course_name"`
	L           string    `excel:"L" json:"l"`
	T           string    `excel:"T" json:"t"`
	P           string    `excel:"P" json:"p"`
	C           string    `excel:"C" json:"c"`
	Instructors string    `excel:"Name of the Instructors and Tutors" json:"instructors"`
	Lecture     Slots     `excel:"Lecture" json:"lecture"`
	Tutorial    Slots     `excel:"Tutorial" json:"tutorial"`
	Lab         Slots     `excel:"Lab" json:"lab"`
	CoursePlan  Hyperlink `excel:"Link to Course Plan" json:"course_plan"`
	Knowledge   string    `excel:"Preferred Knowledge Equivalent to" json:"knowledge"`
	Remarks     string    `excel:"Remarks" json:"remarks"`
	Minor       string    `excel:"Minor in" json:"minor"`
	Elective    string    `excel:"HSS/BS elective" json:"elective"`
}

func (*Timetable) ReadConfigure(rc *exl.ReadConfig) {}

func ParseXlsx() ([]*Timetable, error) {
	// if models, err := exl.ReadFile[*Timetable]("./data/Timetable 2024-25, Sem-II.xlsx"); err != nil {
	// 	fmt.Println("read excel err:" + err.Error())
	// } else {
	// 	fmt.Printf("read excel num: %d\n", len(models))
	// 	fmt.Println(models[13].CourseCode)
	// }

	models, err := exl.ReadFile[*Timetable]("./data/Timetable 2024-25, Sem-II.xlsx")
	// return models, err

	if err != nil {
		return nil, err
	}

	// Filter out rows where both CourseCode and CourseName are empty
	var filteredModels []*Timetable
	for _, model := range models {
		if model.CourseCode != "" || model.CourseName != "" {
			filteredModels = append(filteredModels, model)
		}
	}

	return filteredModels, nil
}
