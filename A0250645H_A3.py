#!/usr/bin/env python
# coding: utf-8

# In[1]:


import warnings
warnings.filterwarnings('ignore')

import pandas as pd 
import numpy as np 
import seaborn as sns  
import matplotlib.pyplot as plt 


# In[2]:


df = pd.read_csv("data_cleaned_2021.csv")
df = df.drop("index",axis=1) 


# In[3]:


df.head(2)


# In[78]:


print("Number of rows in the dataset:",df.shape[0])


# In[5]:


df.isnull().sum()


# In[6]:


df.describe()


# In[7]:


# I notice that there are -1 in rating, and it has no meaning, so I handle the -1 first
df["Rating"] = df["Rating"].apply(lambda x: np.nan if x==-1 else x)

# Fill missing values with the mean of the distribution.
df["Rating"] = df["Rating"].fillna(df["Rating"].mean())


# In[79]:


# I want to see the distribution of their ratings first

plt.figure(figsize=(8,5))
plt.title('\n Distribution of Rating\n', size=16, color='black')
plt.xlabel('\n Rating \n', fontsize=13, color='black')
plt.ylabel('\n Count\n', fontsize=13, color='black')
plt.xticks(fontsize=13)
plt.yticks(fontsize=12)
sns.distplot(df["Rating"],kde=False,color="blue")
plt.savefig("rating.jpg")
plt.show()


# In[80]:


# Then I want to see the distribution of their age since we care much about the layoff

plt.figure(figsize=(14, 4)) 

ax=plt.subplot(1,2,1)
sns.distplot(df.Age,kde=False,color="green")
plt.title('\n Distribution of Age\n', size=16, color='black')
plt.xlabel('\n Age \n', fontsize=13, color='black')
plt.ylabel('\n Count\n', fontsize=13, color='black')

# We can notice that there are a lot of impossible statistics, people can't live to be over 200 years old
# so we can use the boxplot to find the outliers

ax=plt.subplot(1,2,2)
plt.boxplot(df.Age)
plt.title('\n Age Box Plot\n', size=16, color='black')
plt.ylabel('\n Age \n', fontsize=13, color='black')
plt.yticks(fontsize=13)

plt.savefig("age.JPG")
plt.show()


# In[131]:


# And then I wanted to find out which states had the highest average salary, 
# so I sorted them by the highest average salary

g = df.groupby("Job Location")["Avg Salary(K)"].mean().sort_values(ascending=False)[0:10]
print(g)
g = g.reset_index().rename(columns={"Avg Salary(K)":"Average Salary"})


# In[143]:


# Plotting the average salary per annum for different states.
import matplotlib

lab=["California","Illinois","District of Columbia","Massachusetts","New Jersey","Michigan","Rhode island","New York","North Carolina","Maryland"]
plt.figure(figsize=(15,5))
sns.barplot(y="Job Location", x = "Average Salary",data=g)

#Beautifying the plot

plt.title('\n Average Salary In Different States \n', size=16, color='black')
plt.xticks(fontsize=18)
plt.yticks(fontsize=12)
plt.xlabel('\n Average Salary (K) \n', fontsize=13, color='black')
plt.ylabel('\n States \n', fontsize=13, color='black')
patches = [matplotlib.patches.Patch(color=sns.color_palette()[i], label=j) for i,j in zip(range(0,10),lab)]
plt.legend(handles=patches,bbox_to_anchor=(1, 1), loc=2, borderaxespad=0.)
plt.savefig("ave_salary.JPG")
plt.show()


# In[27]:


# First we see how many industries we have in the dataset.

df["Industry"].nunique()


# In[117]:


# And I want to find out the top 10 industrie that with most number of data science related jobs
labels= [x for x in df["Industry"].value_counts().sort_values(ascending=False)[0:10].index] # piechart for only top 5 industry
print(labels)


# In[120]:


plt.figure(figsize=(15,5))
patches,ax,text= plt.pie(df["Industry"].value_counts().sort_values(ascending=False)[0:10],autopct='%1.2f%%',shadow=True,startangle=305)
plt.title('\n Top 10 Industries with Most Number of Data Science Related Jobs \n', size=16, color='black')
plt.legend(patches, labels, loc=3)
plt.axis('equal')
plt.savefig("industry.JPG")
plt.show()


# In[163]:


# Last I want to see the distribution of job titles so that we can know the demond in market

plt.figure(figsize=(200,100))


catp = sns.catplot(x="job_title_sim",data=df,order=df.job_title_sim.value_counts().index,kind="count")
catp.fig.set_size_inches(8,4)

# put data on the bar plot.

spots = df.job_title_sim.value_counts().index
ax = catp.facet_axis(0,0)
for p in ax.patches:
    ax.text(p.get_x() + 0.1, p.get_height()+8, '{:.2f}%'.format((p.get_height()/742)*100))


    
plt.title('\n Job Titles \n', size=16, color='black')
plt.xticks(rotation=90,ha='right', rotation_mode='anchor')
plt.xticks(fontsize=12)
plt.yticks(fontsize=12)
plt.xlabel('\n Job Title \n', fontsize=13, color='black')
plt.ylabel('\n Count \n', fontsize=13, color='black')
plt.savefig("job_title.JPG",bbox_inches="tight")
plt.show()


# In[ ]:




