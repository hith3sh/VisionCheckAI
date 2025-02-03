
import numpy as np
age = 47
gender = 0
dioptre_1 = 0.737636 
dioptre_2 = -1.625104
astigmatism =  92.371608
Phakic_Pseudophakic = 0.666667
Pneumatic =  16.259596
Pachymetry =  536.930380
Axial_Length = 23.551106
VF_MD = -4.344207
eye = 1
tabular_data_arr = [gender, 
                    age, 
                    dioptre_1, 
                    dioptre_2, 
                    astigmatism, 
                    Phakic_Pseudophakic, 
                    Pneumatic, 
                    Pachymetry, 
                    Axial_Length, 
                    VF_MD, 
                    eye
                    ]

tabular_array = np.array([tabular_data_arr], dtype=np.float32)  # Batch dimension
print(tabular_array.shape)