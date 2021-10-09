import os, json, sys
import numpy as np
import pandas as pd
from sklearn import model_selection
import lightgbm as lgb
import matplotlib.pyplot as plt
import seaborn as sns
color = sns.color_palette()

import warnings

warnings.filterwarnings('ignore')

data_path = './Module/data/'
coldict_path = './Module/temp/'
test_path = './Module/temp/'

class NpEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, np.integer):
            return int(obj)
        elif isinstance(obj, np.floating):
            return float(obj)
        elif isinstance(obj, np.ndarray):
            return obj.tolist()
        else:
            return super(NpEncoder, self).default(obj)


def get_data(file_path, optype):
    df = []
    files = os.listdir(file_path)
    for file_name in files:
        if 'malware' not in file_name: continue
        temp_df = pd.read_csv(file_path + file_name)
        df.append(temp_df)

    result = df[0].append([df[i + 1] for i in range(len(df) - 1)])
    head10 = result.head(10).to_json(orient="index", force_ascii=False)
    if optype == 'predict':
        result.sort_values(by='date', axis=0, inplace=True)
        result.index = range(len(result))
    return result, head10


def list_move_left(A, a):
    for i in range(a):
        A.insert(len(A), A[0])
        A.remove(A[0])
    return A


def create_predict_data(result, num=1):
    dates = result.date.str.replace('-0|-', '/')
    dlist = dates.tolist()
    result.date = dlist

    tflist = result.family.tolist()
    pflist = list_move_left(tflist, num)
    result['pfamily'] = pflist
    result = result[:-num]
    return result


def dataclean(train_df):
    train_df = train_df.loc[:, (train_df != train_df.iloc[0]).any()]

    # 清理数据过少列
    #   统计每一列中非0数据的数量

    list = []
    for col in train_df.columns:
        if train_df[col].dtype == 'object':
            list.append(len(train_df) - train_df.loc[train_df[col] == '0'][col].count())
        else:
            list.append(len(train_df) - train_df.loc[train_df[col] == 0][col].count())
    #  list 中的值代表 非0或者非'0' 值的个数

    not0_count_ratio = 5  # 这是一个千分率
    x_col = [col for col in train_df.columns]
    threshold = round(0.001 * not0_count_ratio * len(train_df))
    col_list = []

    #  获取小于阈值的列，即非零数据占比小于千分之5的列
    for i in range(len(list)):
        if list[i] < threshold:
            col_list.append(x_col[i])
    for col in col_list:
        train_df.drop([col], axis=1, inplace=True)

    train_df = train_df.reset_index(drop=True)

    # 清理label数据过少的行
    cla = pd.Series(train_df["family"].value_counts())
    f_num = len(train_df) * 0.005
    cla = cla.iloc[cla.values >= f_num]
    index = cla.index.tolist()
    index2 = [ind for ind, v in train_df.family.iteritems() if v in index]

    train_df = train_df.iloc[index2, :]

    train_df = train_df.reset_index(drop=True)
    return train_df


def encode(train_df):
    col_NNum = [col for col in train_df.columns if train_df[col].dtype == 'object']
    col_Map = []

    for col in col_NNum:
        colmap = {elem: index + 1 for index, elem in enumerate(set(train_df[col]))}
        train_df[col] = train_df[col].map(colmap)
        colmap.update({col: -1})
        c = sorted(colmap.items(), key=lambda x: x[1])
        col_Map.append(c)

    return train_df, col_Map[2]


def data_analysis(train_df,coldict_path, optype):
    x_cols = [col for col in train_df.columns if col not in ['family', 'pfamily'] if train_df[col].dtype != 'object']
    if optype == 'classify':
        dlabel = 'family'
    elif optype == 'predict':
        dlabel = 'pfamily'
        pflist = train_df['family'].tolist()
    train_label = train_df[dlabel]
    train_df = train_df[x_cols].apply(lambda x: (x - np.min(x)) / (np.max(x) - np.min(x)))
    train_df = train_df.round(5)
    train_df = pd.concat([train_df, train_label], axis=1)

    # 变量和目标之间的相关关系
    x_cols = [col for col in train_df.columns if col not in ['family', 'pfamily'] if train_df[col].dtype != 'object']

    labels = []
    values = []
    for col in x_cols:
        labels.append(col)
        values.append(np.corrcoef(train_df[col].values, train_df[dlabel].values)[0, 1])
    corr_df = pd.DataFrame({'col_labels': labels, 'corr_values': values})
    corr_df.fillna(0, inplace=True)
    corr_df = corr_df.sort_values(by='corr_values')

    # 变量之间的相关关系
    corrmat = train_df.corr(method="spearman")
    # f, ax = plt.subplots(figsize=(120, 120))
    sns.heatmap(corrmat, vmax=1., square=True)
    plt.title("Important variables correlation map", fontsize=15)
    plt.savefig(coldict_path + 'corr_hot.jpg')

    if optype == 'predict':
        train_df['family'] = pflist

    return train_df, corr_df, corrmat


def dataprocess(data,coldict_path, optype, num=3):
    data = dataclean(data)
    if optype == 'predict':
        data = create_predict_data(data, num)
    data, coldict = encode(data)
    data, corr1, corr2 = data_analysis(data, coldict_path,optype)
    # data.to_pickle(optype+'data.pkl')
    datashow = showdata(data, coldict, optype)
    return data, coldict, datashow, corr1.to_json(orient="index", force_ascii=False), corr2.to_json(orient="index",
                                                                                                    force_ascii=False)


def showdata(data, coldict, optype):
    dic = {}
    for i in range(1, len(coldict)):
        dic.update({coldict[i][1]: coldict[i][0]})

    if optype == 'classify':
        lst = list(map(lambda x: dic[x], data['family'].values.tolist()))
        return dict(zip(*np.unique(lst, return_counts=True)))
    elif optype == 'predict':
        return data['pfamily'].to_json(orient="index", force_ascii=False)


def dsplit(train_df, optype, test_size=0.1):
    if test_size >= 1:
        print("Err test_size")
        return
    if optype == 'classify':
        label = 'family'
    elif optype == 'predict':
        label = 'pfamily'
    else:
        print("Unknow operation")
        return

    split = model_selection.StratifiedShuffleSplit(n_splits=1, test_size=test_size, random_state=2021)
    for train_index, test_index in split.split(train_df, train_df[label]):
        train_data = train_df.loc[train_df.index.intersection(train_index)]
        test_data = train_df.loc[train_df.index.intersection(test_index)]

    test_data.to_csv(test_path + optype + "_test_data.csv", encoding='utf_8_sig', index=0)

    x_cols = [col for col in train_df.columns if col not in ['family', 'pfamily']]

    x_train = train_data[x_cols]
    y_train = train_data[label]
    x_test = test_data[x_cols]
    y_test = test_data[label]
    lgb_train = lgb.Dataset(x_train, y_train)
    lgb_test = lgb.Dataset(x_test, y_test, reference=lgb_train)
    return lgb_train, lgb_test


def model_train(lgb_train, lgb_test, optype):
    if optype == 'classify':
        pass
    elif optype == 'predict':
        pass
    else:
        print("Unknow operation")
        return

    class_num = 16

    params = {
        'boosting_type': 'gbdt',
        'objective': 'multiclass',
        'is_unbalance': True,
        'metric': 'multi_logloss,multi_error',
        'num_class': class_num,
        'nthread': 4,
        'learning_rate': 0.1,
        "verbosity": -1,
        'num_iterations': 150000,
    }

    evals_result = {}
    gbm = lgb.train(params, lgb_train, valid_sets=[lgb_train, lgb_test], evals_result=evals_result,
                    early_stopping_rounds=10, verbose_eval=False)
    gbm.save_model(test_path + optype + '_model.txt')

    return evals_result


def classifaction_report_csv(report):
    report_data = []
    lines = report.split('\n')
    for line in lines[2:-5]:
        row = {}
        row_data = line.split('      ')
        row['class'] = float(row_data[1])
        row['precision'] = float(row_data[2])
        row['recall'] = float(row_data[3])
        row['f1_score'] = float(row_data[4])
        row['support'] = float(row_data[5])
        report_data.append(row)

    df = pd.DataFrame.from_dict(report_data)
    return df


def model_predict(test_df, optype):
    if optype == 'classify':
        label = 'family'
        pass
    elif optype == 'predict':
        label = 'pfamily'
        pass
    else:
        print("Unknow operation")
        return

    x_cols = [col for col in test_df.columns if col not in ['family', 'pfamily']]
    x_test = test_df[x_cols]
    y_test = test_df[label]

    gbm = lgb.Booster(model_file=test_path + optype + '_model.txt')

    # 预测
    y_p = gbm.predict(x_test, num_iteration=gbm.best_iteration)
    y_pred = np.argmax(y_p, axis=1)
    y_true = y_test.tolist()
    return y_pred


def predict_show(y_pred, coldict, optype):
    dic = {}
    for i in range(1, len(coldict)):
        dic.update({coldict[i][1]: coldict[i][0]})

    if optype == 'classify':
        lst = list(map(lambda x: dic[x], y_pred.tolist()))
        family_count = dict(zip(*np.unique(lst, return_counts=True)))
        return json.dumps(family_count, cls=NpEncoder)
    elif optype == 'predict':
        return pd.Series(y_pred.tolist()).to_json(orient="index", force_ascii=False)


def get_test_data(test_path, optype):
    test_df = pd.read_csv(test_path + optype + "_test_data.csv")
    test_head10 = test_df.head(10).to_json(orient="index", force_ascii=False)
    return test_df, test_head10


def load_data(file_path, optype):
    alldata, _ = get_data(file_path, optype)
    alldata.to_pickle(data_path + 'data.pkl')


def train_data(data_path, coldict_path, optype):
    alldata = pd.read_pickle(data_path + 'data.pkl')
    data, coldict, data_show, corr1, corr2 = dataprocess(alldata,coldict_path, optype)
    lgb_train, lgb_test = dsplit(data, optype)  # create the test data file
    evresult = model_train(lgb_train, lgb_test, optype)
    filename = coldict_path + 'col_dict.json'
    with open(filename, 'w') as file_obj:
        json.dump(coldict, file_obj)
    json_str = json.dumps([data_show, corr1, corr2, evresult], cls=NpEncoder)
    return json_str


def predict_data(test_path, coldict_path, optype):
    test_df, _ = get_test_data(test_path,optype)
    y_pred = model_predict(test_df, optype)
    with open(coldict_path + 'col_dict.json') as f:
        coldict = json.load(f)
    result = predict_show(y_pred, coldict, optype)
    return result


def main(argv):
    optype = argv[1]  # 'classify':分类 ; 'predict': 预测
    opstep = argv[2]  # 'step1':读数据; 'step2':训练数据; 'step3':预测数据

    if optype not in ['classify', 'predict']:
        print("Err optype")
        return

    if opstep not in ['step1', 'step2', 'step3']:
        print("Err opstep")
        return

    elif opstep == 'step1':
        load_data(data_path, optype)

    elif opstep == 'step2':
        train_result = train_data(data_path, coldict_path, optype)
        print(train_result)
        # with open(optype+'_'+opstep+'.txt', "w") as f:
        #     f.write(train_result)
        return train_result

    elif opstep == 'step3':
        predict_result = predict_data(test_path, coldict_path, optype)
        print(predict_result)
        # with open(optype+'_'+opstep+'.txt', "w") as f:
        #     f.write(predict_result)
        return predict_result


if __name__ == '__main__':
    main(sys.argv)
