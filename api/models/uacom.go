package models

import "github.com/jinzhu/gorm"

/*  =========================
	STRUCT UACOM
=========================  */

type Uacom struct {
	CodIbge   uint32 `gorm:"primary_key;foreign_key:CodIbge;not null" json:"cod_ibge"`
	Data      string `gorm:"primary_key;not null" json:"data"`
	Titulo    string `gorm:"default:null" json:"titulo"`
	Relato    string `gorm:"default:null" json:"relato"`
	Descricao string `gorm:"default:null" json:"descricao"`
}

/*  =========================
	FUNCAO SALVAR UACOM
=========================  */

func (uacom *Uacom) SaveUacom(db *gorm.DB) (*Uacom, error) {

	//	Adiciona um novo elemento ao banco de dados
	err := db.Debug().Create(&uacom).Error
	if err != nil {
		return &Uacom{}, err
	}

	return uacom, err
}

/*  =========================
	FUNCAO LISTAR UACOM POR ID
=========================  */

func (uacom *Uacom) FindUacomByID(db *gorm.DB, codIbge uint32, data string) (*Uacom, error) {

	//	Busca um elemento no banco de dados a partir de sua chave primaria
	err := db.Debug().Model(Uacom{}).Where("cod_ibge = ? AND data = ?", codIbge, data).Take(&uacom).Error
	if err != nil {
		return &Uacom{}, err
	}

	return uacom, err
}

/*  =========================
	FUNCAO LISTAR TODAS UACOM
=========================  */

func (uacom *Uacom) FindAllUacom(db *gorm.DB, codIbge uint32) (*[]Uacom, error) {

	allUacom := []Uacom{}

	// Busca todos elementos contidos no banco de dados
	err := db.Debug().Table("uacom").
		Select("uacom.*, GROUP_CONCAT(assunto.descricao ORDER BY assunto.cod_assunto SEPARATOR '\n') AS descricao").
		Joins("LEFT JOIN uacom_assunto ON uacom.cod_ibge = uacom_assunto.cod_ibge AND uacom.data = uacom_assunto.data").
		Joins("LEFT JOIN assunto ON uacom_assunto.cod_assunto = assunto.cod_assunto").
		Where("uacom.cod_ibge = ?", codIbge).
		Group("uacom.cod_ibge, uacom.data").
		Order("uacom.data").
		Scan(&allUacom).Error

	if err != nil {
		return &[]Uacom{}, err
	}

	return &allUacom, err
}

/*  =========================
	FUNCAO EDITAR UACOM
=========================  */

func (uacom *Uacom) UpdateUacom(db *gorm.DB, codIbge uint32, data string) (*Uacom, error) {

	//	Permite a atualizacao dos campos indicados
	db = db.Debug().Exec("UPDATE uacom SET uacom.titulo = ?, uacom.relato = ? WHERE uacom.cod_ibge = ? AND uacom.data = ?", uacom.Titulo, uacom.Relato, codIbge, data)
	if db.Error != nil {
		return &Uacom{}, db.Error
	}

	//	Busca um elemento no banco de dados a partir de sua chave primaria
	err := db.Debug().Model(&Uacom{}).Where("cod_ibge = ? AND data = ?", codIbge, data).Take(&uacom).Error
	if err != nil {
		return &Uacom{}, err
	}

	return uacom, err
}

/*  =========================
	FUNCAO DELETAR UACOM
=========================  */

func (uacom *Uacom) DeleteUacom(db *gorm.DB, codIbge uint32, data string) error {

	//	Deleta um elemento contido no banco de dados a partir de sua chave primaria
	db = db.Debug().Model(&Uacom{}).Where("cod_ibge = ? AND data = ?", codIbge, data).Take(&Uacom{}).Delete(&Uacom{})

	return db.Error
}
